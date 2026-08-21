'use server'

import { revalidatePath } from 'next/cache'

export async function slowAction() {
  // Simulate a slow server action + slow revalidation
  await new Promise((r) => setTimeout(r, 8000))
  revalidatePath('/')
  return { ok: true }
}
