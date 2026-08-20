'use server'

import { cookies } from 'next/headers'

export async function withCookie() {
  const c = await cookies()
  c.set({ name: 'actionCookie', value: String(Date.now()), httpOnly: true })
  return { actionNow: Date.now() }
}

export async function withoutCookie() {
  return { actionNow: Date.now() }
}
