import 'server-only'
import { cookies } from 'next/headers'

export async function getSession() {
  const userId = (await cookies()).get('app_session')?.value
  return { userId }
}
