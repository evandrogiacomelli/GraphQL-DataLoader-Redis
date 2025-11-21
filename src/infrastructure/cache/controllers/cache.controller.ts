import { Controller, Get, Delete } from '@nestjs/common'
import { CacheServiceMultiLayer } from '../cache.service.multi-layer'

@Controller('cache')
export class CacheController {
  constructor(private cacheService: CacheServiceMultiLayer) {}

  @Get('metrics')
  getMetrics() {
    return this.cacheService.getMetrics()
  }

  @Delete('metrics')
  resetMetrics() {
    this.cacheService.resetMetrics()
    return { message: 'Metrics reset successfully' }
  }

  @Delete('clear')
  async clearCache() {
    await this.cacheService.clear()
    return { message: 'Cache cleared successfully' }
  }
}