import { Resolver, Query } from '@nestjs/graphql'
import { metrics } from './MetricsCollector'

@Resolver()
export class MetricsResolver {
  @Query(() => String)
  metrics(): string {
    const stats = metrics.getAllStats()
    return JSON.stringify(stats, null, 2)
  }

  @Query(() => String)
  metricsRaw(): string {
    const all = metrics.getAll()
    return JSON.stringify(Array.from(all.entries()), null, 2)
  }
}