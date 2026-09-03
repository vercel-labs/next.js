import { after } from 'next/server'
import { cookies } from 'next/headers'
import { cliLog } from '../../../utils/log'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const inbound = cookieStore.get('testCookie')?.value ?? null

  cookieStore.set('testCookie', 'route-handler', { path: '/' })
  const inHandler = (await cookies()).get('testCookie')?.value ?? null

  after(async () => {
    const inAfter = (await cookies()).get('testCookie')?.value ?? null
    cliLog({
      source: '[route handler] /route-setting-cookies',
      cookies: { inbound, inHandler, inAfter },
    })
  })

  return Response.json({ inbound, inHandler })
}
