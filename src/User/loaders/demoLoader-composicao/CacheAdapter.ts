import { CacheService } from '@/cache/cache.service'

export class CacheAdapter<V> {
  constructor(private cacheService: CacheService) {}

  async load(key: string): Promise<V | null> {
    const cached = await this.cacheService.get(key)
    if (cached) {
      return JSON.parse(cached)
    }
    return null;
  }

  async save(key: string, value: V, ttl: number): Promise<void> {
    await this.cacheService.set(key, JSON.stringify(value), ttl);
  }
}
