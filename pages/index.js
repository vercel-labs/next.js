export default function Home() {
  return (
    <div>
      <h1>next.config.js i18n + dynamic pages/api route repro</h1>
      <p>See README.md for the bug this reproduces.</p>
      <ul>
        <li>
          <a href="/api/static">/api/static</a> — returns 200 always
        </li>
        <li>
          <a href="/api/dynamic/123">/api/dynamic/123</a> — returns 200
          locally, but 404s once deployed to Vercel while <code>i18n</code>{' '}
          is set in next.config.js
        </li>
      </ul>
    </div>
  )
}
