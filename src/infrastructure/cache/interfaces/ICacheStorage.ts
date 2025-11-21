export interface ICacheStorage {
  get(key: string): Promise<string | null>
  set(key: string, value: string, ttl: number): Promise<void>
  delete(key: string): Promise<void>
  has(key: string): Promise<boolean>
  clear(): Promise<void>
  size(): number
}