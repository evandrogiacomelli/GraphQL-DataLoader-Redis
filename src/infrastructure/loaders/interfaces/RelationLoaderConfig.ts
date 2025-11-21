import type { ILogger } from './ILogger'

export interface RelationLoaderConfig<T extends Record<string, any>> {
  cachePrefix: string
  groupByField: keyof T
  fetchQuery: (keys: string[]) => Promise<T[]>
  ttl?: number
  enableLogs?: boolean
  enableMetrics?: boolean
  logger?: ILogger
}