'use server'

import { cookies } from 'next/headers'

export async function setCookie(): Promise<void> {
  const store = await cookies()
  store.set('foo', 'bar')
}
