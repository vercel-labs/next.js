export default function Page() {
  return (
    <main>
      <h1>next.js + flask rewrite repro (issue #66550)</h1>
      <p>
        Fetch <a href="/api/hello">/api/hello</a>. Works in `next dev` (Flask on
        localhost:5328), fails on Vercel with 404 DNS_HOSTNAME_RESOLVED_PRIVATE.
      </p>
    </main>
  )
}
