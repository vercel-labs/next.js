import { headers } from 'next/headers'

export default async function Page() {
  const h = await headers()
  return (
    <pre id="out">
      {JSON.stringify(
        {
          'x-session-id': h.get('x-session-id'),
          'x-locale': h.get('x-locale'),
        },
        null,
        2
      )}
    </pre>
  )
}
