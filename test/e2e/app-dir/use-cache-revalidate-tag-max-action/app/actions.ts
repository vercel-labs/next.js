'use server'

import { revalidateTag } from 'next/cache'
import { addItem } from './data'

export async function addAction(formData: FormData): Promise<void> {
  await addItem(String(formData.get('value') ?? 'x'))
  revalidateTag('items', 'max')
}
