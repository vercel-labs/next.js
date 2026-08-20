import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const h = await headers()
  const FALLBACK_IP_ADDRESS = '0.0.0.0'
  const forwardedFor = h.get('x-forwarded-for')
  const documentedIp = forwardedFor
    ? (forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS)
    : (h.get('x-real-ip') ?? FALLBACK_IP_ADDRESS)

  return Response.json({
    documentedIp,
    'x-forwarded-for': forwardedFor,
    'x-real-ip': h.get('x-real-ip'),
    'x-vercel-forwarded-for': h.get('x-vercel-forwarded-for'),
  })
}
