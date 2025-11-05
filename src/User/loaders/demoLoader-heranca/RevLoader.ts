import DataLoader from 'dataloader'
import { Dependents } from '@/Dependents/graphql/models/dependents'
import { RedisService } from '@/User/loaders/demoLoader-heranca/RedisBatchLoader'

export class RevLoader extends DataLoader<string, Dependents[]> {
  constructor(private redisService: RedisService, batchLoadFn: DataLoader.BatchLoadFn<string, Dependents[]>) {
    super(batchLoadFn)
  }

  async load(key: string): Promise<Dependents[]> {
    const cached = await this.redisService.load(key)
    if (cached != null) {
      return cached
    }

    const result = await super.load(key)
    await this.redisService.save(key, result, 3600)

    return result
  }
}
