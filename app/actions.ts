'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as db from './data'

export async function addItemAction(formData: FormData) {
  db.addItem(String(formData.get('name') ?? 'item'))
  revalidatePath('/')
}

// Server Function called from a Client Action, no redirect here.
export async function deleteItemAction(id: string) {
  console.log(`[action] deleteItemAction(${id})`)
  db.removeItem(id)
  revalidatePath('/')
  return { ok: true }
}

// Control: revalidatePath + redirect inside the Server Action.
export async function deleteItemAndRedirectAction(id: string) {
  console.log(`[action] deleteItemAndRedirectAction(${id})`)
  db.removeItem(id)
  revalidatePath('/')
  redirect('/')
}
