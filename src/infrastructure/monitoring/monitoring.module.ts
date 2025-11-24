import { Module } from '@nestjs/common';
import { UserAgentClassifier } from './fingerprint/user-agent.classifier';
import { IPAddressClassifier } from './fingerprint/ip-address.classifier';
import { ResponseTimeClassifier } from './fingerprint/response-time.classifier';
import { FingerprintService } from './fingerprint/fingerprint.service';
import { AnomalyDetectorService } from './anomaly-detection/anomaly-detector.service';
import { HealthScoreCalculator } from './health-score/health-score.calculator';
import { HealthScoreService } from './health-score/health-score.service';
import { HealthScoreGateway } from './health-score/health-score.gateway';
import { RequestFingerprintInterceptor } from './interceptors/request-fingerprint.interceptor';

@Module({
  providers: [
    UserAgentClassifier,
    IPAddressClassifier,
    ResponseTimeClassifier,
    FingerprintService,
    AnomalyDetectorService,
    HealthScoreCalculator,
    HealthScoreService,
    HealthScoreGateway,
    RequestFingerprintInterceptor,
  ],
  exports: [
    HealthScoreService,
    RequestFingerprintInterceptor,
  ],
})
export class MonitoringModule {}
