import { cacheLife } from 'next/cache'

let runs = 0

// Mimics the issue's cached DB read: cached for hours, keyed by an argument.
export async function getRoleName(accountId: number) {
  'use cache'
  cacheLife('hours')
  runs++
  const stamp = new Date().toISOString()
  console.log(`[getRoleName] MISS (function body ran) accountId=${accountId} at ${stamp}`)
  return { accountId, roleName: 'admin', producedAt: stamp }
}
