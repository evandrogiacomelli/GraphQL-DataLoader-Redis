import type { ILogger } from './ILogger'

export interface ProcessLoaderConfig<T> {
  cachePrefix: string
  processFn: (keys: string[]) => Promise<Map<string, T>>
  ttl?: number
  enableLogs?: boolean
  enableMetrics?: boolean
  logger?: ILogger
}