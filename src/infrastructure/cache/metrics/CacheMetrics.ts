import { Injectable } from '@nestjs/common'
import { ICacheMetrics, CacheMetrics as Metrics } from '../interfaces/ICacheMetrics'

@Injectable()
export class CacheMetricsCollector implements ICacheMetrics {
  private hotHits = 0
  private hotMisses = 0
  private coldHits = 0
  private coldMisses = 0

  recordHotHit(): void {
    this.hotHits++
  }

  recordHotMiss(): void {
    this.hotMisses++
  }

  recordColdHit(): void {
    this.coldHits++
  }

  recordColdMiss(): void {
    this.coldMisses++
  }

  getMetrics(): Metrics {
    const totalHits = this.hotHits + this.coldHits
    const totalRequests = totalHits + this.coldMisses

    return {
      hotHits: this.hotHits,
      hotMisses: this.hotMisses,
      coldHits: this.coldHits,
      coldMisses: this.coldMisses,
      totalRequests,
      hotHitRate: this.calculateRate(this.hotHits, totalRequests),
      coldHitRate: this.calculateRate(this.coldHits, totalRequests),
      totalHitRate: this.calculateRate(totalHits, totalRequests),
      hotCacheSize: 0,
    }
  }

  private calculateRate(hits: number, total: number): number {
    if (total === 0) return 0
    return (hits / total) * 100
  }

  reset(): void {
    this.hotHits = 0
    this.hotMisses = 0
    this.coldHits = 0
    this.coldMisses = 0
  }
}