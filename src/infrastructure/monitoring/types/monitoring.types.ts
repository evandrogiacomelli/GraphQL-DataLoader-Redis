export interface RequestMetrics {
  readonly path: string;
  readonly method: string;
  readonly userAgent: string;
  readonly ipAddress: string;
  readonly responseTimeMs: number;
  readonly isError: boolean;
  readonly statusCode: number;
}

export interface RequestFingerprint {
  readonly hash: string;
  readonly signature: RequestSignature;
  readonly timestamp: number;
}

export interface RequestSignature {
  readonly path: string;
  readonly method: string;
  readonly userAgentClass: UserAgentClass;
  readonly ipClass: string;
  readonly responseTimeBucket: ResponseTimeBucket;
  readonly status: RequestStatus;
}

export type UserAgentClass = 'browser' | 'bot' | 'cli' | 'mobile' | 'unknown';

export type ResponseTimeBucket = 'fast' | 'normal' | 'slow' | 'very-slow';

export type RequestStatus = 'success' | 'error';

export interface DetectedAnomaly {
  readonly type: AnomalyType;
  readonly severity: AnomalySeverity;
  readonly fingerprint: string;
  readonly message: string;
  readonly metadata: Record<string, unknown>;
  readonly detectedAt: number;
}

export type AnomalyType =
  | 'new_signature'
  | 'statistical_outlier'
  | 'traffic_avalanche'
  | 'pattern_shift';

export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface HealthScore {
  readonly score: number;
  readonly anomalies: DetectedAnomaly[];
  readonly calculatedAt: number;
  readonly metrics: HealthMetrics;
}

export interface HealthMetrics {
  readonly uniqueFingerprints: number;
  readonly totalRequests: number;
  readonly errorRate: number;
  readonly averageResponseTime: number;
}