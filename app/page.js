import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

// Exact snippet from the docs page linked in issue #66305
// docs/02-app/02-api-reference/04-functions/headers.mdx (#ip-address)
function documentedIp(headersList) {
  const FALLBACK_IP_ADDRESS = '0.0.0.0'
  const forwardedFor = headersList.get('x-forwarded-for')

  if (forwardedFor) {
    return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
  }

  return headersList.get('x-real-ip') ?? FALLBACK_IP_ADDRESS
}

export default async function Page() {
  const headersList = await headers()
  const data = {
    documentedIp: documentedIp(headersList),
    'x-forwarded-for': headersList.get('x-forwarded-for'),
    'x-real-ip': headersList.get('x-real-ip'),
    'x-vercel-forwarded-for': headersList.get('x-vercel-forwarded-for'),
  }
  return <pre id="out">{JSON.stringify(data, null, 2)}</pre>
}
