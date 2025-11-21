import os from 'node:os';

export const DEFAULT_WORKERS_COUNT = os.cpus().length;
export const DEFAULT_INSTANCE_ID = 'unknown';
export const GRACEFUL_SHUTDOWN_TIMEOUT_MS = 10000;
export const EXIT_CODE_SUCCESS = 0;
export const EXIT_CODE_ERROR = 1;

export interface ClusterConfig {
  workersCount: number;
  instanceId: string;
}

export function loadClusterConfigFromEnvironment(): ClusterConfig {
  const workersCount = parseInt(
    process.env.CLUSTER_WORKERS || String(DEFAULT_WORKERS_COUNT),
    10
  );
  const instanceId = process.env.INSTANCE_ID || DEFAULT_INSTANCE_ID;

  return { workersCount, instanceId };
}