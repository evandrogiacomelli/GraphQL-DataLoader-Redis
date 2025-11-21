import { CacheAdapter } from '../core/CacheAdapter'
import { CACHE_KEY_SEPARATOR } from '../constants/loader.constants'
import { LoaderLogger } from './LoaderLogger'
import { LoaderMetricsRecorder } from './LoaderMetricsRecorder'

export interface CacheManagerConfig {
  cachePrefix: string
  ttl: number
  enableLogs: boolean
  enableMetrics: boolean
}

export class LoaderCacheManager<K extends string, V> {
  constructor(
    private readonly cacheAdapter: CacheAdapter<V>,
    private readonly logger: LoaderLogger,
    private readonly metricsRecorder: LoaderMetricsRecorder,
    private readonly config: CacheManagerConfig
  ) {}

  async fetchFromCache(keys: readonly K[]): Promise<Map<K, V>> {
    const cacheKeys = this.buildCacheKeys(keys)
    const cacheResults = await this.fetchMultipleCacheKeys(cacheKeys)

    return this.parseCacheResults(keys, cacheResults)
  }

  async saveToCache(data: Map<K, V>): Promise<void> {
    if (data.size === 0) return

    const saveOperations = this.buildSaveOperations(data)
    await Promise.all(saveOperations)
  }

  findMissingKeys(keys: readonly K[], cachedData: Map<K, V>): K[] {
    return keys.filter(key => !cachedData.has(key))
  }

  private buildCacheKeys(keys: readonly K[]): string[] {
    return keys.map(key => `${this.config.cachePrefix}${CACHE_KEY_SEPARATOR}${key}`)
  }

  private async fetchMultipleCacheKeys(cacheKeys: string[]): Promise<(V | null)[]> {
    return Promise.all(cacheKeys.map(key => this.cacheAdapter.load(key)))
  }

  private parseCacheResults(keys: readonly K[], results: (V | null)[]): Map<K, V> {
    const map = new Map<K, V>()

    keys.forEach((key, index) => {
      const result = results[index]

      if (result === null) {
        this.recordCacheMiss(key)
        return
      }

      this.recordCacheHit(key)
      map.set(key, result)
    })

    return map
  }

  private buildSaveOperations(data: Map<K, V>): Promise<void>[] {
    return Array.from(data.entries()).map(([key, value]) => {
      if (this.config.enableLogs) {
        this.logger.logCacheSave(this.config.cachePrefix, key)
      }

      const cacheKey = `${this.config.cachePrefix}${CACHE_KEY_SEPARATOR}${key}`
      return this.cacheAdapter.save(cacheKey, value, this.config.ttl)
    })
  }

  private recordCacheHit(key: K): void {
    if (this.config.enableLogs) {
      this.logger.logCacheHit(this.config.cachePrefix, key)
    }

    if (this.config.enableMetrics) {
      this.metricsRecorder.recordCacheHit(this.config.cachePrefix)
    }
  }

  private recordCacheMiss(key: K): void {
    if (this.config.enableMetrics) {
      this.metricsRecorder.recordCacheMiss(this.config.cachePrefix)
    }
  }
}