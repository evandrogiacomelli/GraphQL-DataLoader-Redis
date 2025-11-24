import { Injectable, OnModuleInit } from '@nestjs/common';
import { HealthScore, RequestMetrics } from '../types/monitoring.types';
import { FingerprintService } from '../fingerprint/fingerprint.service';
import { AnomalyDetectorService } from '../anomaly-detection/anomaly-detector.service';
import { HealthScoreCalculator } from './health-score.calculator';
import { SlidingWindow } from '../anomaly-detection/sliding-window';

@Injectable()
export class HealthScoreService implements OnModuleInit {
  private readonly metricsWindow = new SlidingWindow(2000);
  private currentHealthScore: HealthScore;
  private healthScoreListeners: Array<(score: HealthScore) => void> = [];

  constructor(
    private readonly fingerprintService: FingerprintService,
    private readonly anomalyDetector: AnomalyDetectorService,
    private readonly healthCalculator: HealthScoreCalculator,
  ) {
    this.currentHealthScore = this.createInitialHealthScore();
  }

  onModuleInit() {
    setInterval(() => this.calculateAndEmitHealthScore(), 1000);
  }

  recordRequest(metrics: RequestMetrics): void {
    const fingerprint = this.fingerprintService.generate(metrics);

    this.anomalyDetector.record(fingerprint.hash);
    this.metricsWindow.record(fingerprint.hash);
  }

  getCurrentHealthScore(): HealthScore {
    return this.currentHealthScore;
  }

  onHealthScoreUpdate(listener: (score: HealthScore) => void): void {
    this.healthScoreListeners.push(listener);
  }

  private calculateAndEmitHealthScore(): void {
    const anomalies = this.anomalyDetector['detectAnomalies']();
    const uniqueFingerprints = this.metricsWindow.getUniqueCount();
    const totalRequests = this.metricsWindow.getTotalRequests();

    const healthScore = this.healthCalculator.calculate(
      anomalies,
      uniqueFingerprints,
      totalRequests,
      0,
      0,
    );

    this.currentHealthScore = healthScore;
    this.emitToListeners(healthScore);
  }

  private emitToListeners(healthScore: HealthScore): void {
    this.healthScoreListeners.forEach(listener => {
      try {
        listener(healthScore);
      } catch (error) {
        console.error('[HealthScore] Error in listener:', error);
      }
    });
  }

  private createInitialHealthScore(): HealthScore {
    return {
      score: 100,
      anomalies: [],
      calculatedAt: Date.now(),
      metrics: {
        uniqueFingerprints: 0,
        totalRequests: 0,
        errorRate: 0,
        averageResponseTime: 0,
      },
    };
  }
}