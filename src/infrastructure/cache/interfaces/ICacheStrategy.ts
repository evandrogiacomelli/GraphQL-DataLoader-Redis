export interface CacheResult {
  value: string | null
  layer: 'hot' | 'cold' | 'miss'
}

export interface ICacheStrategy {
  get(key: string): Promise<CacheResult>
  set(key: string, value: string, ttl: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
}