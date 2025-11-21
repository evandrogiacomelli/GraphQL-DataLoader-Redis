import type { ILogger } from './ILogger'

export interface ApiLoaderConfig<T> {
  cachePrefix: string
  fetchFn: (keys: string[]) => Promise<Map<string, T>>
  ttl?: number
  enableLogs?: boolean
  enableMetrics?: boolean
  logger?: ILogger
}