import { Injectable, Inject } from '@nestjs/common'
import type { ICacheStrategy } from './interfaces/ICacheStrategy'
import type { ICacheMetrics } from './interfaces/ICacheMetrics'

@Injectable()
export class CacheServiceMultiLayer {
  constructor(
    @Inject('CacheStrategy') private strategy: ICacheStrategy,
    @Inject('CacheMetrics') private metricsCollector: ICacheMetrics
  ) {}

  async get(key: string): Promise<string | null> {
    const result = await this.strategy.get(key)
    return result.value
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.strategy.set(key, value, ttl)
  }

  async delete(key: string): Promise<void> {
    await this.strategy.delete(key)
  }

  async clear(): Promise<void> {
    await this.strategy.clear()
  }

  getMetrics() {
    return this.metricsCollector.getMetrics()
  }

  resetMetrics(): void {
    this.metricsCollector.reset()
  }
}