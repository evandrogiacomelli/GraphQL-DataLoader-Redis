export class Node<K, V> {
  prev: Node<K, V> | null = null
  next: Node<K, V> | null = null
  key: K | null = null
  value: V | null = null
  expiresAt: number | null = null

  isExpired(): boolean {
    if (this.expiresAt === null) return false
    return Date.now() > this.expiresAt
  }
}