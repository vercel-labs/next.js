export default function Page() {
  console.log('[repro] RENDERED app/page.jsx (children slot) -- should NOT run')
  return <h1>children page</h1>
}
