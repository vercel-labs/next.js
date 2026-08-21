import { cookies, headers } from 'next/headers'

export default async function Page() {
  const c = await cookies()
  const h = await headers()
  return (
    <main>
      <p id="from-cookies">cookies().get(&apos;session&apos;) = {JSON.stringify(c.get('session') ?? null)}</p>
      <p id="raw-cookie-header">incoming cookie header = {JSON.stringify(h.get('cookie') ?? null)}</p>
    </main>
  )
}
export const dynamic = 'force-dynamic'
