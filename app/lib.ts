import "server-only";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { normalize } from "./host";

// Re-export from another module (this is part of the repro shape).
export { normalize };

export type Tenant = { id: string; name: string };

const CACHE_MS = 30_000;
const cache = new Map<string, { value: Tenant | null; at: number }>();

/** Returns `Tenant | null`. The null branch is genuinely reachable. */
export async function byHost(raw: string): Promise<Tenant | null> {
  const host = normalize(raw);
  if (!host) return null;
  const cached = cache.get(host);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;
  const r = await fetch(`https://example.com/${host}`, { cache: "no-store" });
  const body = r.ok ? ((await r.json()) as { tenant?: { active: boolean; id: string; name: string } }) : null;
  const t = body?.tenant;
  const value: Tenant | null = t && t.active ? { id: t.id, name: t.name } : null;
  cache.set(host, { value, at: Date.now() });
  return value;
}

export async function currentHost(): Promise<string> {
  const h = await headers();
  return normalize(h.get("x-forwarded-host") ?? h.get("host") ?? "");
}

/** Thin one-line wrapper. */
export async function currentOrNull(): Promise<Tenant | null> {
  return byHost(await currentHost());
}

// BUG: the `if (!t)` branch is removed from the production build.
export async function brokenGuard(): Promise<Tenant> {
  const t = await currentOrNull();
  if (!t) notFound();
  return t;
}

// BUG: even an explicit `throw` right after `notFound()` is removed.
export async function brokenGuardWithThrow(): Promise<Tenant> {
  const t = await currentOrNull();
  if (!t) {
    notFound();
    throw new Error("unreachable");
  }
  return t;
}

// OK: same shape, value arrives as a parameter.
function require_(t: Tenant | null): Tenant {
  if (!t) notFound();
  return t;
}

export async function okViaParameter(): Promise<Tenant> {
  return require_(await currentOrNull());
}

// OK: same shape, `=== null` instead of a falsy test.
export async function okViaStrictNull(): Promise<Tenant> {
  const t = await currentOrNull();
  if (t === null) notFound();
  return t;
}
