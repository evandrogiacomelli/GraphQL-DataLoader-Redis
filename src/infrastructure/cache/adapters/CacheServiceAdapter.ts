import { Injectable } from '@nestjs/common'
import { CacheServiceMultiLayer } from '../cache.service.multi-layer'

@Injectable()
export class CacheServiceAdapter {
  constructor(private cacheMultiLayer: CacheServiceMultiLayer) {}

  async get(key: string): Promise<string | null> {
    return this.cacheMultiLayer.get(key)
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.cacheMultiLayer.set(key, value, ttl)
  }

  async del(key: string): Promise<void> {
    await this.cacheMultiLayer.delete(key)
  }
}