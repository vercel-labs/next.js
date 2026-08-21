'use server'

import { revalidateTag } from 'next/cache'

export async function refresh() {
  revalidateTag('tag')
}
