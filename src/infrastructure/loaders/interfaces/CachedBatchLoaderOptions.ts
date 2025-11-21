import type { CacheService } from '@/infrastructure/cache/cache.service'
import type { ILogger } from './ILogger'

export interface CachedBatchLoaderOptions<K extends string, V> {
  cacheService: CacheService
  dbFetchFn: (keys: K[]) => Promise<Map<K, V>>
  cachePrefix: string
  ttl?: number
  enableLogs?: boolean
  enableMetrics?: boolean
  logger?: ILogger
}

export interface CombineResultsParams<K, V> {
  keys: readonly K[]
  cachedData: Map<K, V>
  dbData: Map<K, V>
}