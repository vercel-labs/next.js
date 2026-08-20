import { redirect, unstable_rethrow } from 'next/navigation'

export async function GET() {
  try {
    redirect('/target')
  } catch (err) {
    unstable_rethrow(err)
    return new Response('real error', { status: 500 })
  }
}
