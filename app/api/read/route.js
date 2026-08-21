import { cookies, headers } from 'next/headers'
export async function GET() {
  const c = await cookies()
  const h = await headers()
  return Response.json({
    cookiesSession: c.get('session') ?? null,
    incomingCookieHeader: h.get('cookie') ?? null,
  })
}
export const dynamic = 'force-dynamic'
