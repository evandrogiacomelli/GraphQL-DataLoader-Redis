export class ClusterLogger {
  constructor(private readonly instanceId: string) {}

  logMasterProcessStarted(pid: number): void {
    console.log(`[${this.instanceId}] Master process ${pid} is running`);
  }

  logForkingWorkers(count: number): void {
    console.log(`[${this.instanceId}] Forking ${count} workers...`);
  }

  logWorkerStarted(workerId: number, totalWorkers: number, pid: number): void {
    console.log(
      `[${this.instanceId}] Worker ${workerId}/${totalWorkers} started with PID ${pid}`
    );
  }

  logWorkerDied(pid: number, reason: string | number): void {
    console.log(
      `[${this.instanceId}] Worker ${pid} died (${reason}). Restarting...`
    );
  }

  logWorkerRestarted(pid: number): void {
    console.log(`[${this.instanceId}] New worker started with PID ${pid}`);
  }

  logMasterReceivedShutdownSignal(signal: string): void {
    console.log(
      `[${this.instanceId}] Master received ${signal}, shutting down gracefully...`
    );
  }

  logWorkerStartingNestApplication(workerId: number, pid: number): void {
    console.log(
      `[${this.instanceId}] Worker ${workerId} (PID ${pid}) starting NestJS application...`
    );
  }

  logWorkerSuccessfullyStarted(workerId: number, pid: number): void {
    console.log(
      `[${this.instanceId}] Worker ${workerId} (PID ${pid}) successfully started`
    );
  }

  logWorkerFailedToStart(workerId: number, pid: number, error: Error): void {
    console.error(
      `[${this.instanceId}] Worker ${workerId} (PID ${pid}) failed to start:`,
      error
    );
  }

  logWorkerReceivedShutdownSignal(workerId: number, pid: number, signal: string): void {
    console.log(
      `[${this.instanceId}] Worker ${workerId} (PID ${pid}) received ${signal}, shutting down...`
    );
  }

  logGracefulShutdownTimeoutExceeded(): void {
    console.error(
      `[${this.instanceId}] Graceful shutdown timeout exceeded. Forcing exit.`
    );
  }

  logFatalErrorInWorkerStartup(error: unknown): void {
    console.error(`[${this.instanceId}] Fatal error in worker startup:`, error);
  }

  logWaitingForWorkersToExit(remainingWorkers: number): void {
    console.log(
      `[${this.instanceId}] Waiting for ${remainingWorkers} worker(s) to exit...`
    );
  }

  logAllWorkersExited(): void {
    console.log(`[${this.instanceId}] All workers exited. Master shutting down.`);
  }

  logForcingKillRemainingWorkers(remainingWorkers: number): void {
    console.warn(
      `[${this.instanceId}] Forcing kill of ${remainingWorkers} remaining worker(s) with SIGKILL`
    );
  }
}