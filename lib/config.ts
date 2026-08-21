import { cacheLife } from 'next/cache'

export async function getTenantConfig() {
  'use cache'
  cacheLife('weeks')
  return { tenant: 'acme', ts: Date.now() }
}
