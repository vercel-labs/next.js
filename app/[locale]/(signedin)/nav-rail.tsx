import { cookies, headers } from 'next/headers'

export async function NavRail({ section = 'root' }: { section?: string }) {
  const c = await cookies()
  const h = await headers()
  // mirrors the reported 400ms-2.3s chrome re-suspension
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 1200))
  return (
    <nav data-navrail={section}>
      user:{c.get('session')?.value ?? 'anon'} ua:
      {(h.get('user-agent') ?? '').slice(0, 8)}
    </nav>
  )
}
