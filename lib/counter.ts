// Module-level side effect + global singleton guard.
// In a real app this is where a Mongoose model / Redis client is created.
const g = globalThis as any;

console.log(
  '[lib/counter] MODULE EVALUATED. pid=%s global.__requests before reset: %s',
  process.pid,
  g.__requests
);
g.__requests = 0;

export function bump(label: string) {
  g.__requests = (g.__requests ?? 0) + 1;
  console.log(`[${label}] pid=${process.pid} requests:`, g.__requests);
  return g.__requests;
}
