export function normalize(raw: string): string {
  return raw.trim().toLowerCase().split(':')[0]
}
