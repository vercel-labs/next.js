import { unauthorized } from 'next/navigation'

export async function GET() {
  const session = false
  if (!session) {
    unauthorized()
  }
  return new Response('ok')
}
