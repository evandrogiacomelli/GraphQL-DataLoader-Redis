import { Injectable, Scope } from '@nestjs/common'
import { CachedBatchLoader } from './CachedBatchLoader'
import type { CacheService } from '@/infrastructure/cache/cache.service'
import type { EntityLoaderConfig } from '../interfaces/EntityLoaderConfig'
import { buildMapByField } from './helpers/buildMapByField'

@Injectable({ scope: Scope.REQUEST })
export class EntityLoader<T extends Record<string, any>> {
  private readonly loader: CachedBatchLoader<string, T>

  constructor(cacheService: CacheService, config: EntityLoaderConfig<T>) {
    this.loader = new CachedBatchLoader({
      cacheService,
      dbFetchFn: async (keys) => {
        const items = await config.fetchQuery(keys)
        return buildMapByField(items, config.idField)
      },
      cachePrefix: config.cachePrefix,
      ttl: config.ttl,
      enableLogs: config.enableLogs,
      enableMetrics: config.enableMetrics,
      logger: config.logger,
    })
  }

  load(key: string): Promise<T> {
    return this.loader.load(key)
  }
}