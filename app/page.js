import { headers, cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const h = await headers()
  const c = await cookies()
  const raw = h.get('cookie')
  const all = c.getAll().map((x) => `${x.name}=${x.value}`).join('; ')
  console.log('[repro] headers().get("cookie") =', raw)
  console.log('[repro] cookies().getAll()      =', all)
  return (
    <pre>{JSON.stringify({ headersCookie: raw, cookiesGetAll: all }, null, 2)}</pre>
  )
}
