import { Module, Global } from '@nestjs/common'
import { RedisModule } from '@/infrastructure/cache/Redis/redis.module'
import { CacheServiceMultiLayer } from './cache.service.multi-layer'
import { HotStorage } from './storage/HotStorage'
import { ColdStorage } from './storage/ColdStorage'
import { TieredCacheStrategy } from './strategies/TieredCacheStrategy'
import { CacheMetricsCollector } from './metrics/CacheMetrics'
import { CacheController } from './controllers/cache.controller'

@Global()
@Module({
  imports: [RedisModule],
  controllers: [CacheController],
  providers: [
    {
      provide: 'HotStorage',
      useFactory: () => new HotStorage(10000),
    },
    {
      provide: 'ColdStorage',
      useClass: ColdStorage,
    },
    {
      provide: 'CacheMetrics',
      useClass: CacheMetricsCollector,
    },
    {
      provide: 'CacheStrategy',
      useFactory: (
        hotStorage: HotStorage,
        coldStorage: ColdStorage,
        metrics: CacheMetricsCollector
      ) => {
        return new TieredCacheStrategy(hotStorage, coldStorage, metrics)
      },
      inject: ['HotStorage', 'ColdStorage', 'CacheMetrics'],
    },
    {
      provide: CacheServiceMultiLayer,
      useFactory: (strategy: TieredCacheStrategy, metrics: CacheMetricsCollector) => {
        return new CacheServiceMultiLayer(strategy, metrics)
      },
      inject: ['CacheStrategy', 'CacheMetrics'],
    },
  ],
  exports: [CacheServiceMultiLayer],
})
export class CacheModuleMultiLayer {}