import { metrics } from './MetricsCollector'

export class PrometheusAdapter {

  toPrometheus(): string {
    const lines: string[] = []
    const allStats = metrics.getAllStats()

    lines.push('# HELP loader_cache_hit_total Total cache hits')
    lines.push('# TYPE loader_cache_hit_total counter')

    lines.push('# HELP loader_cache_miss_total Total cache misses')
    lines.push('# TYPE loader_cache_miss_total counter')

    lines.push('# HELP loader_cache_hit_rate Cache hit rate percentage')
    lines.push('# TYPE loader_cache_hit_rate gauge')

    lines.push('# HELP loader_db_queries_total Total database queries')
    lines.push('# TYPE loader_db_queries_total counter')

    lines.push('# HELP loader_avg_latency_ms Average latency in milliseconds')
    lines.push('# TYPE loader_avg_latency_ms gauge')

    lines.push('# HELP loader_requests_total Total requests')
    lines.push('# TYPE loader_requests_total counter')

    for (const stat of allStats) {
      if (!stat) continue

      const prefix = stat.prefix
      lines.push(`loader_cache_hit_total{loader="${prefix}"} ${stat.hit}`)
      lines.push(`loader_cache_miss_total{loader="${prefix}"} ${stat.miss}`)
      lines.push(`loader_cache_hit_rate{loader="${prefix}"} ${stat.hitRate}`)
      lines.push(`loader_db_queries_total{loader="${prefix}"} ${stat.dbQueries}`)
      lines.push(`loader_avg_latency_ms{loader="${prefix}"} ${stat.avgLatency}`)
      lines.push(`loader_requests_total{loader="${prefix}"} ${stat.totalRequests}`)
    }

    return lines.join('\n')
  }
}