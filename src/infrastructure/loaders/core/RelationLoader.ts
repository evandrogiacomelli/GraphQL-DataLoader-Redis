import { Injectable, Scope } from '@nestjs/common'
import { CachedBatchLoader } from './CachedBatchLoader'
import type { CacheService } from '@/infrastructure/cache/cache.service'
import type { RelationLoaderConfig } from '../interfaces/RelationLoaderConfig'
import { groupByField } from './helpers/groupByField'

@Injectable({ scope: Scope.REQUEST })
export class RelationLoader<T extends Record<string, any>> {
  private readonly loader: CachedBatchLoader<string, T[]>

  constructor(cacheService: CacheService, config: RelationLoaderConfig<T>) {
    this.loader = new CachedBatchLoader({
      cacheService,
      dbFetchFn: async (keys) => {
        const items = await config.fetchQuery(keys)
        return groupByField(items, config.groupByField, keys)
      },
      cachePrefix: config.cachePrefix,
      ttl: config.ttl,
      enableLogs: config.enableLogs,
      enableMetrics: config.enableMetrics,
      logger: config.logger,
    })
  }

  load(key: string): Promise<T[]> {
    return this.loader.load(key)
  }
}