import cluster, { Worker } from 'node:cluster';
import { ClusterLogger } from './cluster-logger';
import { ClusterConfig, GRACEFUL_SHUTDOWN_TIMEOUT_MS, EXIT_CODE_SUCCESS, EXIT_CODE_ERROR } from './cluster-config';

export class MasterProcessManager {
  private readonly logger: ClusterLogger;
  private readonly workersCount: number;
  private isShuttingDown: boolean;

  constructor(config: ClusterConfig) {
    this.logger = new ClusterLogger(config.instanceId);
    this.workersCount = config.workersCount;
    this.isShuttingDown = false;
  }

  startMasterProcess(): void {
    this.logger.logMasterProcessStarted(process.pid);
    this.logger.logForkingWorkers(this.workersCount);

    this.forkAllWorkers();
    this.listenForWorkerExit();
    this.listenForShutdownSignals();
  }

  private forkAllWorkers(): void {
    for (let i = 0; i < this.workersCount; i++) {
      this.forkWorker(i + 1);
    }
  }

  private forkWorker(workerNumber: number): void {
    const worker = cluster.fork();
    this.logger.logWorkerStarted(
      workerNumber,
      this.workersCount,
      worker.process.pid!
    );
  }

  private listenForWorkerExit(): void {
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
      this.handleWorkerExit(worker, code, signal);
    });
  }

  private handleWorkerExit(worker: Worker, code: number, signal: string): void {
    const reason = signal || code;
    this.logger.logWorkerDied(worker.process.pid!, reason);

    if (this.isShuttingDown) {
      this.checkIfAllWorkersExited();
    } else {
      this.restartWorker();
    }
  }

  private restartWorker(): void {
    const newWorker = cluster.fork();
    this.logger.logWorkerRestarted(newWorker.process.pid!);
  }

  private checkIfAllWorkersExited(): void {
    const remainingWorkers = Object.keys(cluster.workers || {}).length;

    if (remainingWorkers > 0) {
      this.logger.logWaitingForWorkersToExit(remainingWorkers);
    } else {
      this.logger.logAllWorkersExited();
      this.exitGracefully();
    }
  }

  private listenForShutdownSignals(): void {
    process.on('SIGTERM', () => this.handleShutdownSignal('SIGTERM'));
    process.on('SIGINT', () => this.handleShutdownSignal('SIGINT'));
  }

  private handleShutdownSignal(signal: string): void {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    this.logger.logMasterReceivedShutdownSignal(signal);
    this.killAllWorkers();
    this.scheduleForceExitAfterTimeout();
    this.checkIfAllWorkersExited();
  }

  private killAllWorkers(): void {
    for (const id in cluster.workers) {
      cluster.workers[id]?.kill();
    }
  }

  private scheduleForceExitAfterTimeout(): void {
    setTimeout(() => {
      this.logger.logGracefulShutdownTimeoutExceeded();
      this.forceKillRemainingWorkers();
      this.exitWithError();
    }, GRACEFUL_SHUTDOWN_TIMEOUT_MS);
  }

  private forceKillRemainingWorkers(): void {
    const remainingWorkers = Object.keys(cluster.workers || {});

    if (remainingWorkers.length > 0) {
      this.logger.logForcingKillRemainingWorkers(remainingWorkers.length);

      for (const id of remainingWorkers) {
        const worker = cluster.workers?.[id];
        if (worker?.process.pid) {
          worker.process.kill('SIGKILL');
        }
      }
    }
  }

  private exitGracefully(): void {
    process.exit(EXIT_CODE_SUCCESS);
  }

  private exitWithError(): void {
    process.exit(EXIT_CODE_ERROR);
  }
}