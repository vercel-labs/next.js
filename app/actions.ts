'use server'

import { revalidatePath } from 'next/cache'

// "saving a value in the database" then revalidating an *unrelated* path
export async function saveAndRevalidateOtherPath() {
  revalidatePath('/other')
  return 'revalidatePath("/other") called'
}

export async function saveAndRevalidateHome() {
  revalidatePath('/')
  return 'revalidatePath("/") called'
}
