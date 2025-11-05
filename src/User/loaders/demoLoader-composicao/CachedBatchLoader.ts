import DataLoader from 'dataloader'
import { CacheAdapter } from '@/User/loaders/demoLoader-composicao/CacheAdapter'
import { CacheService } from '@/cache/cache.service'

export class CachedBatchLoader<K extends string, V> {
  private dataLoader: DataLoader<K, V>
  private cache: CacheAdapter<V>

  constructor(cacheService: CacheService, batchLoadFn: DataLoader.BatchLoadFn<K, V>) {
    this.cache = new CacheAdapter<V>(cacheService)
    this.dataLoader = new DataLoader(batchLoadFn)
  }

  async load(key: K): Promise<V> {
    const cached = await this.cache.load(key)
    if (cached != null) return cached

    const result = await this.dataLoader.load(key)
    await this.cache.save(key, result, 3600)
    return result
  }
}
