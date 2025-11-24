interface FingerprintStatistics {
  mean: number;
  stdDev: number;
  sampleCount: number;
}

export class BaselineTracker {
  private statistics = new Map<string, FingerprintStatistics>();
  private readonly learningRate = 0.1;

  hasBaseline(fingerprint: string): boolean {
    return this.statistics.has(fingerprint);
  }

  getStatistics(fingerprint: string): FingerprintStatistics | undefined {
    return this.statistics.get(fingerprint);
  }

  updateBaseline(fingerprint: string, observedCount: number): void {
    const current = this.statistics.get(fingerprint);

    if (!current) {
      this.initializeStatistics(fingerprint, observedCount);
      return;
    }

    this.updateStatistics(fingerprint, current, observedCount);
  }

  calculateZScore(fingerprint: string, observedCount: number): number {
    const stats = this.statistics.get(fingerprint);

    if (!stats || stats.stdDev === 0) {
      return 0;
    }

    return Math.abs((observedCount - stats.mean) / stats.stdDev);
  }

  private initializeStatistics(fingerprint: string, count: number): void {
    this.statistics.set(fingerprint, {
      mean: count,
      stdDev: count * 0.1,
      sampleCount: 1,
    });
  }

  private updateStatistics(
    fingerprint: string,
    current: FingerprintStatistics,
    observedCount: number,
  ): void {
    const newMean = this.calculateMovingAverage(current.mean, observedCount);
    const newStdDev = this.calculateMovingStdDev(current, newMean, observedCount);

    this.statistics.set(fingerprint, {
      mean: newMean,
      stdDev: newStdDev,
      sampleCount: current.sampleCount + 1,
    });
  }

  private calculateMovingAverage(currentMean: number, newValue: number): number {
    return currentMean * (1 - this.learningRate) + newValue * this.learningRate;
  }

  private calculateMovingStdDev(
    current: FingerprintStatistics,
    newMean: number,
    observedCount: number,
  ): number {
    const variance =
      Math.pow(current.stdDev, 2) * (1 - this.learningRate) +
      Math.pow(observedCount - newMean, 2) * this.learningRate;

    return Math.sqrt(variance);
  }
}