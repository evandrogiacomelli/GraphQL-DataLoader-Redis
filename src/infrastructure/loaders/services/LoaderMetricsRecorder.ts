import { metrics } from '../metrics/MetricsCollector'

export class LoaderMetricsRecorder {
  recordCacheHit(cachePrefix: string): void {
    metrics.hit(cachePrefix)
  }

  recordCacheMiss(cachePrefix: string): void {
    metrics.miss(cachePrefix)
  }

  recordDbQuery(cachePrefix: string): void {
    metrics.dbQuery(cachePrefix)
  }

  startTimer(timerKey: string): void {
    metrics.startTimer(timerKey)
  }

  endTimer(cachePrefix: string, timerKey: string): void {
    metrics.endTimer(cachePrefix, timerKey)
  }

  async measureBatch<T>(cachePrefix: string, fn: () => Promise<T>): Promise<T> {
    const timerKey = `${cachePrefix}-${Date.now()}`
    this.startTimer(timerKey)

    try {
      return await fn()
    } finally {
      this.endTimer(cachePrefix, timerKey)
    }
  }
}