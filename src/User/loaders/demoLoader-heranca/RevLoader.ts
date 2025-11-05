import DataLoader from 'dataloader'
import { Dependents } from '@/Dependents/graphql/models/dependents'
import { CacheAdapter } from '@/User/loaders/demoLoader-heranca/CacheAdapter'

export class RevLoader extends DataLoader<string, Dependents[]> {
  constructor(private cache: CacheAdapter, batchLoadFn: DataLoader.BatchLoadFn<string, Dependents[]>) {
    super(batchLoadFn)
  }

  async load(key: string): Promise<Dependents[]> {
    const cached = await this.cache.load(key)
    if (cached != null) {
      return cached
    }

    const result = await super.load(key)
    await this.cache.save(key, result, 3600)

    return result
  }
}
