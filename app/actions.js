'use server'
import { revalidatePath } from 'next/cache'
import { db } from './store'

export async function updateInvoice(formData) {
  db.customerId = formData.get('customerId')
  db.name = formData.get('name')
  console.log('[action] saved', db)
  revalidatePath('/')
  // NOTE: no redirect() here, mirroring the issue's step 2
}
