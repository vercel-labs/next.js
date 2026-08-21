import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function ControlPage() {
  const h = await headers()
  return (
    <pre>
      {JSON.stringify(
        {
          route: '/control (force-dynamic, no force-static ancestor)',
          userAgent: h.get('user-agent') ?? null,
          headerCount: [...h.keys()].length,
        },
        null,
        2
      )}
    </pre>
  )
}
