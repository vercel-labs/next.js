import { revalidatePath } from 'next/cache'

export async function POST(request) {
  console.info('revalidate')

  revalidatePath('/test')

  return new Response(null, { status: 204 })
}
