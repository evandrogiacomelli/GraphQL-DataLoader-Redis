import DataLoader from 'dataloader'
import type { CacheService } from '@/infrastructure/cache/cache.service'
import { CacheAdapter } from './CacheAdapter'
import { CachedBatchLoaderOptions } from '../interfaces/CachedBatchLoaderOptions'
import { LoaderCacheManager, CacheManagerConfig } from '../services/LoaderCacheManager'
import { LoaderLogger } from '../services/LoaderLogger'
import { LoaderMetricsRecorder } from '../services/LoaderMetricsRecorder'
import { DEFAULT_LOADER_TTL_SECONDS, DEFAULT_LOGS_ENABLED, DEFAULT_METRICS_ENABLED } from '../constants/loader.constants'

export class CachedBatchLoader<K extends string, V> {
  private readonly dataLoader: DataLoader<K, V>
  private readonly cacheManager: LoaderCacheManager<K, V>
  private readonly logger: LoaderLogger
  private readonly metricsRecorder: LoaderMetricsRecorder
  private readonly dbFetchFn: (keys: K[]) => Promise<Map<K, V>>
  private readonly config: CacheManagerConfig

  constructor(options: CachedBatchLoaderOptions<K, V>) {
    const {
      cacheService,
      dbFetchFn,
      cachePrefix,
      ttl = DEFAULT_LOADER_TTL_SECONDS,
      enableLogs = DEFAULT_LOGS_ENABLED,
      enableMetrics = DEFAULT_METRICS_ENABLED,
      logger
    } = options

    this.dbFetchFn = dbFetchFn
    this.config = { cachePrefix, ttl, enableLogs, enableMetrics }

    this.logger = new LoaderLogger(logger)
    this.metricsRecorder = new LoaderMetricsRecorder()

    const cacheAdapter = new CacheAdapter<V>(cacheService)
    this.cacheManager = new LoaderCacheManager(
      cacheAdapter,
      this.logger,
      this.metricsRecorder,
      this.config
    )

    this.dataLoader = this.createDataLoader()
  }

  async load(key: K): Promise<V> {
    return this.dataLoader.load(key)
  }

  private createDataLoader(): DataLoader<K, V> {
    return new DataLoader(async (keys: readonly K[]) => {
      return this.processBatch(keys)
    })
  }

  private async processBatch(keys: readonly K[]): Promise<V[]> {
    if (!this.config.enableMetrics) {
      return this.executeBatch(keys)
    }

    return this.metricsRecorder.measureBatch(
      this.config.cachePrefix,
      () => this.executeBatch(keys)
    )
  }

  private async executeBatch(keys: readonly K[]): Promise<V[]> {
    const cachedData = await this.cacheManager.fetchFromCache(keys)
    const missingKeys = this.cacheManager.findMissingKeys(keys, cachedData)

    if (this.config.enableLogs && missingKeys.length > 0) {
      this.logger.logCacheMisses(this.config.cachePrefix, missingKeys)
    }

    const dbData = await this.fetchFromDatabase(missingKeys)

    this.persistToCache(dbData)

    return this.combineResults(keys, cachedData, dbData)
  }

  private async fetchFromDatabase(missingKeys: K[]): Promise<Map<K, V>> {
    if (missingKeys.length === 0) {
      return new Map<K, V>()
    }

    if (this.config.enableLogs) {
      this.logger.logDbFetch(this.config.cachePrefix, missingKeys)
    }

    if (this.config.enableMetrics) {
      this.metricsRecorder.recordDbQuery(this.config.cachePrefix)
    }

    return this.dbFetchFn(missingKeys)
  }

  private persistToCache(data: Map<K, V>): void {
    if (data.size === 0) return

    this.cacheManager.saveToCache(data).catch(err => {
      this.logger.logCacheSaveError(this.config.cachePrefix, err)
    })
  }

  private combineResults(keys: readonly K[], cachedData: Map<K, V>, dbData: Map<K, V>): V[] {
    return keys.map(key => {
      const cachedValue = cachedData.get(key)
      if (cachedValue !== undefined) {
        return cachedValue
      }

      const dbValue = dbData.get(key)
      if (dbValue === undefined) {
        throw new Error(`Missing data for key: ${key} in both cache and database`)
      }

      return dbValue
    })
  }
}
