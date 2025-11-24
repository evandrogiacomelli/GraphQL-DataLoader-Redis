import { Injectable } from '@nestjs/common';
import { ResponseTimeBucket } from '../types/monitoring.types';

@Injectable()
export class ResponseTimeClassifier {
  private readonly FAST_THRESHOLD_MS = 50;
  private readonly NORMAL_THRESHOLD_MS = 200;
  private readonly SLOW_THRESHOLD_MS = 500;

  classify(responseTimeMs: number): ResponseTimeBucket {
    if (responseTimeMs < this.FAST_THRESHOLD_MS) {
      return 'fast';
    }

    if (responseTimeMs < this.NORMAL_THRESHOLD_MS) {
      return 'normal';
    }

    if (responseTimeMs < this.SLOW_THRESHOLD_MS) {
      return 'slow';
    }

    return 'very-slow';
  }
}