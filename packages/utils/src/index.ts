export function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0)
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function debounce<T extends (...args: any[]) => void>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms) }
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

export function uniqueBy<T>(arr: T[], key: (item: T) => string | number): T[] {
  const seen = new Set<string | number>()
  return arr.filter(item => { const k = key(item); if (seen.has(k)) return false; seen.add(k); return true })
}

export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i)
}

export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => { const k = key(item); (acc[k] ||= []).push(item); return acc }, {} as Record<string, T[]>)
}