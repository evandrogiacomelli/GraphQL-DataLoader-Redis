export function buildMapByField<T extends Record<string, any>>(
  items: T[],
  idField: keyof T
): Map<string, T> {
  const map = new Map<string, T>()

  for (const item of items) {
    const key = item[idField] as string
    map.set(key, item)
  }

  return map
}