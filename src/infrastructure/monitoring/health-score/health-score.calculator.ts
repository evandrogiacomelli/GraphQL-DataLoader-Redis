import { Injectable } from '@nestjs/common';
import { DetectedAnomaly, HealthScore } from '../types/monitoring.types';

@Injectable()
export class HealthScoreCalculator {
  private readonly SEVERITY_WEIGHTS = {
    low: 5,
    medium: 10,
    high: 20,
    critical: 40,
  };

  calculate(
    anomalies: DetectedAnomaly[],
    uniqueFingerprints: number,
    totalRequests: number,
    errorRate: number,
    averageResponseTime: number,
  ): HealthScore {
    const baseScore = 100;
    const anomalyPenalty = this.calculateAnomalyPenalty(anomalies);
    const errorPenalty = errorRate * 50;
    const performancePenalty = this.calculatePerformancePenalty(averageResponseTime);

    const finalScore = Math.max(
      0,
      baseScore - anomalyPenalty - errorPenalty - performancePenalty,
    );

    return {
      score: Math.round(finalScore),
      anomalies,
      calculatedAt: Date.now(),
      metrics: {
        uniqueFingerprints,
        totalRequests,
        errorRate,
        averageResponseTime,
      },
    };
  }

  private calculateAnomalyPenalty(anomalies: DetectedAnomaly[]): number {
    return anomalies.reduce((penalty, anomaly) => {
      return penalty + this.SEVERITY_WEIGHTS[anomaly.severity];
    }, 0);
  }

  private calculatePerformancePenalty(averageResponseTime: number): number {
    if (averageResponseTime < 100) return 0;
    if (averageResponseTime < 500) return 5;
    if (averageResponseTime < 1000) return 15;
    return 30;
  }
}