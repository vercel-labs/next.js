// Per React docs: throwing on the server inside a Suspense boundary should
// render the fallback on the server and retry on the client.
// https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content
export default function ClientOnly() {
  if (typeof window === 'undefined') {
    throw new Error('this component only works on client')
  }
  return <p id="client-content">Client-only content rendered on the client</p>
}
