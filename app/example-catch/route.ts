import { redirect } from 'next/navigation'

export async function GET() {
  try {
    // pretend work, then redirect inside the try block
    redirect('/target')
  } catch (err) {
    console.log('CAUGHT IN ROUTE HANDLER:', (err as Error)?.message)
    return new Response('caught error', { status: 500 })
  }
  return new Response('unreachable')
}
