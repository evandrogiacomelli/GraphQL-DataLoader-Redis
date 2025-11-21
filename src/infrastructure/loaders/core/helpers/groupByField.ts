export function groupByField<T extends Record<string, any>>(
  items: T[],
  groupByField: keyof T,
  keys: string[]
): Map<string, T[]> {
  const map = new Map<string, T[]>()

  keys.forEach(key => map.set(key, []))

  for (const item of items) {
    const key = item[groupByField] as string
    map.get(key)?.push(item)
  }

  return map
}