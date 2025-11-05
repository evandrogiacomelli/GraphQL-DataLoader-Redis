import { CacheService } from '@/cache/cache.service'
import { Dependents } from '@/Dependents/graphql/models/dependents'

export class RedisService {
  constructor(private cacheService: CacheService) {}

  async load(key: string): Promise<Dependents[] | null> {
    const cached = await this.cacheService.get(key)
    if (cached) {
      console.log('CACHE HIT:', key)
      return JSON.parse(cached)
    }
    return null
  }

  async save(key: string, value: Dependents[], ttl: number): Promise<void> {
    console.log('SALVANDO NO REDIS:', key)
    await this.cacheService.set(key, JSON.stringify(value), ttl)
  }
}
