import { revalidatePath } from 'next/cache'

export async function POST(request) {
  console.info('revalidate')

  revalidatePath('/test2.local/test')

  return new Response(null, { status: 204 })
}
