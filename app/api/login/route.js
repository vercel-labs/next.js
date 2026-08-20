import { cookies } from 'next/headers'
import { encrypt } from '../../../lib/session'

// Mirrors the docs' createSession(): "encrypt" the session, then store it in a cookie.
export async function GET() {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({
    userId: 'user_42',
    role: 'admin',
    email: 'secret@example.com',
  })
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
  return Response.json({ cookie: session })
}
