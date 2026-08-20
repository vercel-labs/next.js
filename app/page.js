import { cookies } from 'next/headers'

// Decodes the "encrypted" session WITHOUT the SESSION_SECRET, to show the
// payload is plaintext (base64url JWS), not encrypted.
export default async function Page() {
  const cookie = (await cookies()).get('session')?.value
  let decodedWithoutSecret = null
  if (cookie) {
    decodedWithoutSecret = JSON.parse(
      Buffer.from(cookie.split('.')[1], 'base64url').toString()
    )
  }
  return (
    <main>
      <h1>Docs &quot;encrypted&quot; session</h1>
      <p>Visit <a href="/api/login">/api/login</a> first.</p>
      <pre id="cookie">{cookie ?? 'no session cookie'}</pre>
      <h2>Payload read without the secret key</h2>
      <pre id="decoded">{JSON.stringify(decodedWithoutSecret, null, 2)}</pre>
    </main>
  )
}
