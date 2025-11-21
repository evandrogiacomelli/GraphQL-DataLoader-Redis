import { Node } from './Node'

export class LRUCache<K, V> {
  private head: Node<K, V>
  private tail: Node<K, V>
  private map: Map<K, Node<K, V>>
  private capacity: number
  private nodeCount: number

  constructor(capacity: number) {
    this.head = new Node<K, V>()
    this.tail = new Node<K, V>()
    this.map = new Map()
    this.capacity = capacity
    this.nodeCount = 0

    this.head.next = this.tail
    this.tail.prev = this.head
  }

  put(key: K, value: V, ttlMs?: number): void {
    const existingNode = this.map.get(key)

    if (existingNode) {
      this.updateExistingNode(existingNode, value, ttlMs)
      return
    }

    this.addNewNode(key, value, ttlMs)
  }

  private updateExistingNode(node: Node<K, V>, value: V, ttlMs?: number): void {
    node.value = value
    node.expiresAt = ttlMs ? Date.now() + ttlMs : null
    this.moveNodeToHead(node)
  }

  private addNewNode(key: K, value: V, ttlMs?: number): void {
    this.evictIfNeeded(key)

    const node = new Node<K, V>()
    node.key = key
    node.value = value
    node.expiresAt = ttlMs ? Date.now() + ttlMs : null

    this.map.set(key, node)
    this.addNodeToHead(node)
    this.nodeCount++
  }

  private evictIfNeeded(newKey: K): void {
    if (this.nodeCount < this.capacity) return

    const evictNode = this.tail.prev
    if (!evictNode || evictNode === this.head) return

    console.log(`[LRU] EVICT: ${evictNode.key} → ADD: ${newKey}`)
    this.removeNode(evictNode)
    this.map.delete(evictNode.key!)
    this.nodeCount--
  }

  private addNodeToHead(node: Node<K, V>): void {
    node.next = this.head.next
    node.prev = this.head

    if (this.head.next) {
      this.head.next.prev = node
    }

    this.head.next = node
  }

  private removeNode(node: Node<K, V>): void {
    if (!node.prev || !node.next) return

    node.prev.next = node.next
    node.next.prev = node.prev
  }

  private moveNodeToHead(node: Node<K, V>): void {
    this.removeNode(node)
    this.addNodeToHead(node)
  }

  get(key: K): V | null {
    const node = this.map.get(key)

    if (!node) return null

    if (node.isExpired()) {
      this.delete(key)
      return null
    }

    this.moveNodeToHead(node)
    return node.value
  }

  has(key: K): boolean {
    const node = this.map.get(key)

    if (!node) return false

    if (node.isExpired()) {
      this.delete(key)
      return false
    }

    return true
  }

  delete(key: K): void {
    const node = this.map.get(key)

    if (!node) return

    this.removeNode(node)
    this.map.delete(key)
    this.nodeCount--
  }

  clear(): void {
    this.map.clear()
    this.nodeCount = 0
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  size(): number {
    return this.nodeCount
  }

  getCapacity(): number {
    return this.capacity
  }
}