import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '@/cache/Redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
