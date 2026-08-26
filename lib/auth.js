import 'server-only'
import { redirect } from 'next/navigation'
import { getSession } from './session.js'
import { findUserById } from './data.js'

export async function getCurrentUser() {
  'use cache: private'

  const { userId } = await getSession()
  if (!userId) {
    redirect('/login')
  }
  const user = await findUserById(userId)
  if (!user) {
    redirect('/login')
  }
  return { id: user.id, name: user.name }
}
