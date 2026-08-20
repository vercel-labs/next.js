import { cookies } from 'next/headers'

export async function GET() {
  const c = await cookies()
  // @ts-expect-error encode is not in the public option types
  c.set('rh_cookie', 'qwerty123=', { encode: String })
  return new Response('ok')
}
