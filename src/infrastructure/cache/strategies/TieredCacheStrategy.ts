import { Injectable, Inject } from '@nestjs/common'
import type { ICacheStrategy } from '../interfaces/ICacheStrategy'
import type { ICacheStorage } from '../interfaces/ICacheStorage'
import type { ICacheMetrics } from '../interfaces/ICacheMetrics'
import { CacheResult } from '../interfaces/ICacheStrategy'

@Injectable()
export class TieredCacheStrategy implements ICacheStrategy {
  constructor(
    @Inject('HotStorage') private hotStorage: ICacheStorage,
    @Inject('ColdStorage') private coldStorage: ICacheStorage,
    @Inject('CacheMetrics') private metrics: ICacheMetrics
  ) {}

  async get(key: string): Promise<CacheResult> {
    const hotResult = await this.tryGetFromHot(key)
    if (hotResult.value !== null) return hotResult

    const coldResult = await this.tryGetFromCold(key)
    if (coldResult.value !== null) return coldResult

    return this.createMissResult()
  }

  private async tryGetFromHot(key: string): Promise<CacheResult> {
    const value = await this.hotStorage.get(key)

    if (value === null) {
      this.metrics.recordHotMiss()
      return this.createMissResult()
    }

    this.metrics.recordHotHit()
    console.log(`[HotCache] HIT ${key}`)
    return { value, layer: 'hot' }
  }

  private async tryGetFromCold(key: string): Promise<CacheResult> {
    const value = await this.coldStorage.get(key)

    if (value === null) {
      this.metrics.recordColdMiss()
      return this.createMissResult()
    }

    this.metrics.recordColdHit()
    console.log(`[ColdCache] HIT ${key}`)
    await this.promoteToHot(key, value)
    return { value, layer: 'cold' }
  }

  private async promoteToHot(key: string, value: string): Promise<void> {
    await this.hotStorage.set(key, value, 300)
  }

  private createMissResult(): CacheResult {
    return { value: null, layer: 'miss' }
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.saveToBothLayers(key, value, ttl)
  }

  private async saveToBothLayers(key: string, value: string, ttl: number): Promise<void> {
    await Promise.all([
      this.hotStorage.set(key, value, Math.min(ttl, 300)),
      this.coldStorage.set(key, value, ttl)
    ])
  }

  async delete(key: string): Promise<void> {
    await this.deleteFromBothLayers(key)
  }

  private async deleteFromBothLayers(key: string): Promise<void> {
    await Promise.all([
      this.hotStorage.delete(key),
      this.coldStorage.delete(key)
    ])
  }

  async clear(): Promise<void> {
    await this.clearBothLayers()
  }

  private async clearBothLayers(): Promise<void> {
    await Promise.all([
      this.hotStorage.clear(),
      this.coldStorage.clear()
    ])
  }
}