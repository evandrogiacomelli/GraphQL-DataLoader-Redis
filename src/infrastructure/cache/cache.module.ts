import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisModule } from '@/infrastructure/cache/Redis/redis.module';

@Global()
@Module({
  imports: [RedisModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
