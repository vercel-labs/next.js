'use server'

export async function increment(n: number) {
  console.log('[server] ACTION START n=' + n)
  await new Promise((r) => setTimeout(r, 100))
  console.log('[server] ACTION END n=' + n)
  return n + 1
}
