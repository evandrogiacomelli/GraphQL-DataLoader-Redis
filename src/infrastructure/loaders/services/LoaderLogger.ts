import type { ILogger } from '../interfaces/ILogger'
import { ConsoleLogger } from './ConsoleLogger'

export class LoaderLogger {
  private readonly logger: ILogger

  constructor(logger?: ILogger) {
    this.logger = logger ?? new ConsoleLogger()
  }

  logCacheHit(cachePrefix: string, key: string): void {
    this.logger.debug(`[${cachePrefix}] Cache HIT: ${key}`)
  }

  logCacheMiss(cachePrefix: string, key: string): void {
    this.logger.debug(`[${cachePrefix}] Cache MISS: ${key}`)
  }

  logCacheMisses(cachePrefix: string, keys: string[]): void {
    if (keys.length === 0) return
    this.logger.debug(`[${cachePrefix}] Cache MISS for ${keys.length} keys`)
  }

  logDbFetch(cachePrefix: string, keys: string[]): void {
    if (keys.length === 0) return
    this.logger.debug(`[${cachePrefix}] Fetching ${keys.length} keys from database`)
  }

  logCacheSave(cachePrefix: string, key: string): void {
    this.logger.debug(`[${cachePrefix}] Saved to cache: ${key}`)
  }

  logCacheSaveError(cachePrefix: string, error: unknown): void {
    this.logger.error(`[${cachePrefix}] Cache save failed`, error instanceof Error ? error.stack : error)
  }
}