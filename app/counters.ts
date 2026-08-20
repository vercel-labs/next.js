export const counts: Record<string, number> = {}
export function bump(name: string) {
  counts[name] = (counts[name] ?? 0) + 1
  return counts[name]
}
