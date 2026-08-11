export default function Home() {
  return (
    <main>
      <h1>next#80051 – docs status code reproduction</h1>
      <p>
        <code>/api/route</code> is copied verbatim from the Pages Router
        authentication docs (&quot;Creating a Data Access Layer (DAL)&quot; →
        &quot;Protecting API Routes&quot;). An authenticated non-admin user gets
        401 instead of 403.
      </p>
      <ul>
        <li>
          <a href="/api/route?session=none">/api/route?session=none</a> → expect
          401
        </li>
        <li>
          <a href="/api/route?session=user">/api/route?session=user</a> → docs
          give 401, should be 403
        </li>
        <li>
          <a href="/api/route?session=admin">/api/route?session=admin</a> → 200
        </li>
      </ul>
    </main>
  )
}
