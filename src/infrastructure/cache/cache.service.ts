import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
  ) {}

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.redisClient.set(key, value, {
        EX: ttlSeconds,
      });
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }
}
