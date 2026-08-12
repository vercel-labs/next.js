// The shape below is the minimal reproduction from
// https://github.com/vercel/next.js/issues/96944: the guarded value comes from
// `await`ing an async function returning `T | null`, the guard uses a falsy
// test, the guarded functions are consumed from another module, and this module
// also re-exports a symbol from another module.
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { normalize } from './host'

// Re-exporting a symbol from another module is part of the repro shape.
export { normalize }

export type Tenant = { id: string; name: string }

const tenants = new Map<string, Tenant>([['acme', { id: '1', name: 'Acme' }]])

export async function byHost(raw: string): Promise<Tenant | null> {
  const host = normalize(raw)
  if (!host) return null
  const found = await Promise.resolve(tenants.get(host))
  return found ?? null
}

export async function currentHost(): Promise<string> {
  const h = await headers()
  return normalize(h.get('x-tenant-host') ?? '')
}

export async function currentOrNull(): Promise<Tenant | null> {
  return byHost(await currentHost())
}

// Was compiled to `async function j(){return await i()}` before the fix.
export async function guardWithFalsyTest(): Promise<Tenant> {
  const t = await currentOrNull()
  if (!t) notFound()
  return t
}

// Was compiled to `async function j(){return await i()}` before the fix.
// The trailing `throw` was dropped as well before the fix.
export async function guardWithFalsyTestAndThrow(): Promise<Tenant> {
  const t = await currentOrNull()
  if (!t) {
    notFound()
    throw new Error('unreachable')
  }
  return t
}

function requireTenant(t: Tenant | null): Tenant {
  if (!t) notFound()
  return t
}

export async function guardViaParameter(): Promise<Tenant> {
  return requireTenant(await currentOrNull())
}

export async function guardWithStrictNull(): Promise<Tenant> {
  const t = await currentOrNull()
  if (t === null) notFound()
  return t
}
