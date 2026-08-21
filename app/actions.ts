'use server'
import { revalidateTag } from 'next/cache'

export async function refreshHealth() {
  revalidateTag('health')
}
