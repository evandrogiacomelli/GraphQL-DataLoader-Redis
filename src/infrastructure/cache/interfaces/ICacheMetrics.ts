export interface CacheMetrics {
  hotHits: number
  hotMisses: number
  coldHits: number
  coldMisses: number
  totalRequests: number
  hotHitRate: number
  coldHitRate: number
  totalHitRate: number
  hotCacheSize: number
}

export interface ICacheMetrics {
  recordHotHit(): void
  recordHotMiss(): void
  recordColdHit(): void
  recordColdMiss(): void
  getMetrics(): CacheMetrics
  reset(): void
}