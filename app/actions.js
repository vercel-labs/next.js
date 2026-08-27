'use server'
import { revalidatePath } from 'next/cache'
let counter = 0
export async function publish(prevState, formData) {
  counter++
  revalidatePath('/')
  return { status: 'success', counter, name: formData.get('name') }
}
