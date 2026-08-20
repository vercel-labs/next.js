'use server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateBothPaths() {
  revalidatePath('/a')
  revalidatePath('/b')
}

export async function revalidateBothTags() {
  revalidateTag('tag1', 'max')
  revalidateTag('tag2', 'max')
}
