import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HealthScoreService } from '../health-score/health-score.service';
import { RequestMetrics } from '../types/monitoring.types';

@Injectable()
export class RequestFingerprintInterceptor implements NestInterceptor {
  constructor(private readonly healthScoreService: HealthScoreService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const metrics = this.buildMetrics(request, startTime, false, 200);
          this.healthScoreService.recordRequest(metrics);
        },
        error: (error) => {
          const statusCode = error.status || 500;
          const metrics = this.buildMetrics(request, startTime, true, statusCode);
          this.healthScoreService.recordRequest(metrics);
        },
      }),
    );
  }

  private buildMetrics(
    request: any,
    startTime: number,
    isError: boolean,
    statusCode: number,
  ): RequestMetrics {
    const responseTimeMs = Date.now() - startTime;

    return {
      path: request.route?.path || request.url,
      method: request.method,
      userAgent: request.headers['user-agent'] || '',
      ipAddress: this.extractIPAddress(request),
      responseTimeMs,
      isError,
      statusCode,
    };
  }

  private extractIPAddress(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }
}