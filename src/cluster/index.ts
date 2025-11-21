import cluster from 'node:cluster';
import { loadClusterConfigFromEnvironment, EXIT_CODE_ERROR, ClusterConfig } from './cluster-config';
import { MasterProcessManager } from './master-process-manager';
import { WorkerProcessManager } from './worker-process-manager';
import { ClusterLogger } from './cluster-logger';

export function startClusterApplication(): void {
  const config = loadClusterConfigFromEnvironment();

  if (cluster.isPrimary) {
    startMasterProcess(config);
  } else {
    startWorkerProcess(config);
  }
}

function startMasterProcess(config: ClusterConfig): void {
  const master = new MasterProcessManager(config);
  master.startMasterProcess();
}

function startWorkerProcess(config: ClusterConfig): void {
  const worker = new WorkerProcessManager(config);

  worker.startWorkerProcess().catch((error) => {
    handleWorkerStartupError(error, config);
  });
}

function handleWorkerStartupError(error: unknown, config: ClusterConfig): void {
  const logger = new ClusterLogger(config.instanceId);
  logger.logFatalErrorInWorkerStartup(error);
  process.exit(EXIT_CODE_ERROR);
}
