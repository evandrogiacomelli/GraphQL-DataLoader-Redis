import { Injectable } from '@nestjs/common';
import * as murmur from 'murmurhash-js';
import {
  RequestMetrics,
  RequestFingerprint,
  RequestSignature,
  RequestStatus,
} from '../types/monitoring.types';
import { UserAgentClassifier } from './user-agent.classifier';
import { IPAddressClassifier } from './ip-address.classifier';
import { ResponseTimeClassifier } from './response-time.classifier';

@Injectable()
export class FingerprintService {
  constructor(
    private readonly userAgentClassifier: UserAgentClassifier,
    private readonly ipClassifier: IPAddressClassifier,
    private readonly responseTimeClassifier: ResponseTimeClassifier,
  ) {}

  generate(metrics: RequestMetrics): RequestFingerprint {
    const signature = this.buildSignature(metrics);
    const hash = this.hashSignature(signature);

    return {
      hash,
      signature,
      timestamp: Date.now(),
    };
  }

  private buildSignature(metrics: RequestMetrics): RequestSignature {
    return {
      path: metrics.path,
      method: metrics.method,
      userAgentClass: this.userAgentClassifier.classify(metrics.userAgent),
      ipClass: this.ipClassifier.classify(metrics.ipAddress),
      responseTimeBucket: this.responseTimeClassifier.classify(metrics.responseTimeMs),
      status: this.determineStatus(metrics),
    };
  }

  private determineStatus(metrics: RequestMetrics): RequestStatus {
    return metrics.isError ? 'error' : 'success';
  }

  private hashSignature(signature: RequestSignature): string {
    const signatureString = [
      signature.path,
      signature.method,
      signature.userAgentClass,
      signature.ipClass,
      signature.responseTimeBucket,
      signature.status,
    ].join(':');

    const hash = murmur.murmur3(signatureString);
    return hash.toString(16);
  }
}