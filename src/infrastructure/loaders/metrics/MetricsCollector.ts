export interface MetricData {
  hit: number
  miss: number
  dbQueries: number
  totalLatency: number
  count: number
}

export class MetricsCollector {
  private metrics: Map<string, MetricData>
  private startTimes: Map<string, number>

  constructor() {
    this.metrics = new Map()
    this.startTimes = new Map()
  }

  hit(prefix: string): void {
    this.getOrCreate(prefix).hit++
  }

  miss(prefix: string): void {
    this.getOrCreate(prefix).miss++
  }

  dbQuery(prefix: string): void {
    this.getOrCreate(prefix).dbQueries++
  }

  startTimer(id: string): void {
    this.startTimes.set(id, Date.now())
  }

  endTimer(prefix: string, id: string): void {
    const start = this.startTimes.get(id)
    if (!start) return

    const latency = Date.now() - start
    const metric = this.getOrCreate(prefix)
    metric.totalLatency += latency
    metric.count++

    this.startTimes.delete(id)
  }

  get(prefix: string): MetricData | undefined {
    return this.metrics.get(prefix)
  }

  getAll(): Map<string, MetricData> {
    return new Map(this.metrics)
  }

  getStats(prefix: string) {
    const data = this.metrics.get(prefix)
    if (!data) return null

    const total = data.hit + data.miss
    const hitRate = total > 0 ? (data.hit / total) * 100 : 0
    const avgLatency = data.count > 0 ? data.totalLatency / data.count : 0

    return {
      prefix,
      hit: data.hit,
      miss: data.miss,
      hitRate: Math.round(hitRate * 100) / 100,
      dbQueries: data.dbQueries,
      avgLatency: Math.round(avgLatency * 100) / 100,
      totalRequests: total
    }
  }

  getAllStats() {
    return Array.from(this.metrics.keys()).map(prefix => this.getStats(prefix))
  }

  reset(prefix?: string): void {
    if (prefix) {
      this.metrics.delete(prefix)
    } else {
      this.metrics.clear()
      this.startTimes.clear()
    }
  }

  private getOrCreate(prefix: string): MetricData {
    let data = this.metrics.get(prefix)
    if (!data) {
      data = { hit: 0, miss: 0, dbQueries: 0, totalLatency: 0, count: 0 }
      this.metrics.set(prefix, data)
    }
    return data
  }
}

export const metrics = new MetricsCollector()
