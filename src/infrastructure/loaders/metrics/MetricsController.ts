import { Controller, Get, Header } from '@nestjs/common'
import { PrometheusAdapter } from '@/infrastructure/loaders'

@Controller('metrics')
export class MetricsController {
  private prometheus = new PrometheusAdapter()

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4')
  getMetrics(): string {
    return this.prometheus.toPrometheus()
  }
}
