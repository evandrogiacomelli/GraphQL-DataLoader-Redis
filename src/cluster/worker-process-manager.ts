import cluster from 'node:cluster';
import { ClusterLogger } from './cluster-logger';
import { ClusterConfig, EXIT_CODE_SUCCESS, EXIT_CODE_ERROR } from './cluster-config';

export class WorkerProcessManager {
  private readonly logger: ClusterLogger;
  private readonly workerId: number;

  constructor(config: ClusterConfig) {
    this.logger = new ClusterLogger(config.instanceId);
    this.workerId = cluster.worker?.id || 0;
  }

  async startWorkerProcess(): Promise<void> {
    this.logger.logWorkerStartingNestApplication(this.workerId, process.pid);

    try {
      await this.bootstrapNestApplication();
      this.logger.logWorkerSuccessfullyStarted(this.workerId, process.pid);
      this.listenForShutdownSignal();
    } catch (error) {
      this.handleBootstrapError(error);
    }
  }

  private async bootstrapNestApplication(): Promise<void> {
    await import('../main.js');
  }

  private handleBootstrapError(error: unknown): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.logger.logWorkerFailedToStart(this.workerId, process.pid, errorObj);
    process.exit(EXIT_CODE_ERROR);
  }

  private listenForShutdownSignal(): void {
    process.on('SIGTERM', () => this.handleShutdownSignal());
  }

  private handleShutdownSignal(): void {
    this.logger.logWorkerReceivedShutdownSignal(this.workerId, process.pid, 'SIGTERM');
    process.exit(EXIT_CODE_SUCCESS);
  }
}