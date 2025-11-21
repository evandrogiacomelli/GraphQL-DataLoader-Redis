import { Injectable, Scope } from '@nestjs/common'
import { CachedBatchLoader } from './CachedBatchLoader'
import type { CacheService } from '@/infrastructure/cache/cache.service'
import type { ApiLoaderConfig } from '../interfaces/ApiLoaderConfig'

@Injectable({ scope: Scope.REQUEST })
export class ApiLoader<T> {
  private readonly loader: CachedBatchLoader<string, T>

  constructor(cacheService: CacheService, config: ApiLoaderConfig<T>) {
    this.loader = new CachedBatchLoader({
      cacheService,
      dbFetchFn: config.fetchFn,
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