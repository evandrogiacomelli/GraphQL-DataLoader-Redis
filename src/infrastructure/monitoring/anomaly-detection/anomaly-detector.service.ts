import { Injectable, OnModuleInit } from '@nestjs/common';
import { DetectedAnomaly } from '../types/monitoring.types';
import { SlidingWindow } from './sliding-window';
import { BaselineTracker } from './baseline-tracker';

@Injectable()
export class AnomalyDetectorService implements OnModuleInit {
  private readonly window = new SlidingWindow(2000);
  private readonly baseline = new BaselineTracker();

  private readonly OUTLIER_Z_SCORE_THRESHOLD = 3;
  private readonly AVALANCHE_PERCENTAGE_THRESHOLD = 50;
  private readonly NEW_SIGNATURE_MIN_COUNT = 5;

  onModuleInit() {
    setInterval(() => this.analyze(), 1000);
  }

  record(fingerprint: string): void {
    this.window.record(fingerprint);
  }

  private analyze(): void {
    const anomalies = this.detectAnomalies();

    if (anomalies.length === 0) {
      this.updateBaseline();
    }
  }

  private detectAnomalies(): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = [];

    anomalies.push(...this.detectNewSignatures());
    anomalies.push(...this.detectStatisticalOutliers());
    anomalies.push(...this.detectTrafficAvalanches());

    return anomalies;
  }

  private detectNewSignatures(): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = [];
    const fingerprints = this.window.getAllFingerprints();

    for (const [fingerprint, count] of fingerprints) {
      if (!this.baseline.hasBaseline(fingerprint) && count >= this.NEW_SIGNATURE_MIN_COUNT) {
        anomalies.push({
          type: 'new_signature',
          severity: this.calculateSeverity(count),
          fingerprint,
          message: `New request pattern detected: ${fingerprint}`,
          metadata: { count },
          detectedAt: Date.now(),
        });
      }
    }

    return anomalies;
  }

  private detectStatisticalOutliers(): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = [];
    const fingerprints = this.window.getAllFingerprints();

    for (const [fingerprint, count] of fingerprints) {
      if (!this.baseline.hasBaseline(fingerprint)) {
        continue;
      }

      const zScore = this.baseline.calculateZScore(fingerprint, count);

      if (zScore > this.OUTLIER_Z_SCORE_THRESHOLD) {
        anomalies.push({
          type: 'statistical_outlier',
          severity: this.calculateOutlierSeverity(zScore),
          fingerprint,
          message: `Request pattern deviating from baseline: ${fingerprint}`,
          metadata: { zScore: zScore.toFixed(2), count },
          detectedAt: Date.now(),
        });
      }
    }

    return anomalies;
  }

  private detectTrafficAvalanches(): DetectedAnomaly[] {
    const anomalies: DetectedAnomaly[] = [];
    const fingerprints = this.window.getAllFingerprints();
    const totalRequests = this.window.getTotalRequests();

    if (totalRequests === 0) {
      return anomalies;
    }

    for (const [fingerprint, count] of fingerprints) {
      const percentage = (count / totalRequests) * 100;

      if (percentage > this.AVALANCHE_PERCENTAGE_THRESHOLD) {
        anomalies.push({
          type: 'traffic_avalanche',
          severity: 'critical',
          fingerprint,
          message: `Single pattern dominating traffic: ${fingerprint}`,
          metadata: { percentage: percentage.toFixed(1), count, totalRequests },
          detectedAt: Date.now(),
        });
      }
    }

    return anomalies;
  }

  private updateBaseline(): void {
    const fingerprints = this.window.getAllFingerprints();

    for (const [fingerprint, count] of fingerprints) {
      this.baseline.updateBaseline(fingerprint, count);
    }
  }

  private calculateSeverity(count: number): DetectedAnomaly['severity'] {
    if (count > 100) return 'high';
    if (count > 50) return 'medium';
    return 'low';
  }

  private calculateOutlierSeverity(zScore: number): DetectedAnomaly['severity'] {
    if (zScore > 5) return 'critical';
    if (zScore > 4) return 'high';
    if (zScore > 3) return 'medium';
    return 'low';
  }
}