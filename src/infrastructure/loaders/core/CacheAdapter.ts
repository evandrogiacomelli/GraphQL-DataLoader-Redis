import type { CacheService } from '@/infrastructure/cache/cache.service'

export class CacheAdapter<V> {
  constructor(private cacheService: CacheService) {}

  async load(key: string): Promise<V | null> {
    const cached = await this.cacheService.get(key)
    if (!cached) {
      return null
    }

    try {
      return JSON.parse(cached, this.dateReviver)
    } catch (err) {
      console.error('JSON parse error:', err)
      return null
    }
  }

  async save(key: string, value: V, ttl: number): Promise<void> {
    await this.cacheService.set(key, JSON.stringify(value), ttl)
  }

  private dateReviver(key: string, value: any): any {
    if (typeof value === 'string') {
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
      if (isoDateRegex.test(value)) {
        return new Date(value)
      }
    }
    return value
  }
}