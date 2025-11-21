import { Injectable, Inject } from '@nestjs/common'
import type { RedisClientType } from 'redis'
import type { ICacheStorage } from '../interfaces/ICacheStorage'

@Injectable()
export class ColdStorage implements ICacheStorage {
  constructor(
    @Inject('REDIS_CLIENT') private redis: RedisClientType
  ) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redis.set(key, value, { EX: ttl })
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async has(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key)
    return exists === 1
  }

  async clear(): Promise<void> {
    await this.redis.flushDb()
  }

  size(): number {
    return 0
  }
}