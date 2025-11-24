export class SlidingWindow {
  private fingerprintCounts = new Map<string, number>();
  private readonly windowSizeMs: number;
  private windowStartTime: number;

  constructor(windowSizeMs: number) {
    this.windowSizeMs = windowSizeMs;
    this.windowStartTime = Date.now();
  }

  record(fingerprint: string): void {
    this.rotateIfNeeded();

    const currentCount = this.fingerprintCounts.get(fingerprint) || 0;
    this.fingerprintCounts.set(fingerprint, currentCount + 1);
  }

  getCount(fingerprint: string): number {
    return this.fingerprintCounts.get(fingerprint) || 0;
  }

  getAllFingerprints(): Map<string, number> {
    return new Map(this.fingerprintCounts);
  }

  getTotalRequests(): number {
    return Array.from(this.fingerprintCounts.values()).reduce(
      (sum, count) => sum + count,
      0,
    );
  }

  getUniqueCount(): number {
    return this.fingerprintCounts.size;
  }

  clear(): void {
    this.fingerprintCounts.clear();
    this.windowStartTime = Date.now();
  }

  private rotateIfNeeded(): void {
    const now = Date.now();
    const elapsed = now - this.windowStartTime;

    if (elapsed >= this.windowSizeMs) {
      this.clear();
    }
  }
}