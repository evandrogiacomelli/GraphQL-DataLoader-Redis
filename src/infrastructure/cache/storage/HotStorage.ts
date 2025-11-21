import { Injectable } from '@nestjs/common'
import { ICacheStorage } from '../interfaces/ICacheStorage'
import { LRUCache } from '../core/LRUCache'

@Injectable()
export class HotStorage implements ICacheStorage {
  private cache: LRUCache<string, string>

  constructor(capacity: number = 10000) {
    this.cache = new LRUCache(capacity)
  }

  async get(key: string): Promise<string | null> {
    return this.cache.get(key)
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    const ttlMs = ttl * 1000
    this.cache.put(key, value, ttlMs)
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size()
  }

  getCapacity(): number {
    return this.cache.getCapacity()
  }
}