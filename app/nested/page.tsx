import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function NestedPage() {
  const h = await headers()
  return (
    <pre>
      {JSON.stringify(
        {
          route: '/nested (force-dynamic page under force-static layout)',
          userAgent: h.get('user-agent') ?? null,
          headerCount: [...h.keys()].length,
        },
        null,
        2
      )}
    </pre>
  )
}
