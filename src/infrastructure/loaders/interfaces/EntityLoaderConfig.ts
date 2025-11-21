import type { ILogger } from './ILogger'

export interface EntityLoaderConfig<T extends Record<string, any>> {
  cachePrefix: string
  idField: keyof T
  fetchQuery: (keys: string[]) => Promise<T[]>
  ttl?: number
  enableLogs?: boolean
  enableMetrics?: boolean
  logger?: ILogger
}