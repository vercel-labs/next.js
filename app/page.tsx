// Force dynamic rendering so the middleware nonce is injected into the
// framework's script tags on every request.
export const dynamic = 'force-dynamic'

export default function Page() {
  return <h1>Home</h1>
}
