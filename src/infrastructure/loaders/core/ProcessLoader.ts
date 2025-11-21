import { Injectable, Scope } from '@nestjs/common'
import { CachedBatchLoader } from './CachedBatchLoader'
import type { CacheService } from '@/infrastructure/cache/cache.service'
import type { ProcessLoaderConfig } from '../interfaces/ProcessLoaderConfig'

@Injectable({ scope: Scope.REQUEST })
export class ProcessLoader<T> {
  private readonly loader: CachedBatchLoader<string, T>

  constructor(cacheService: CacheService, config: ProcessLoaderConfig<T>) {
    this.loader = new CachedBatchLoader({
      cacheService,
      dbFetchFn: config.processFn,
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