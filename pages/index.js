export default function Home() {
  return (
    <div id="home">
      <p>Reproduction for vercel/next.js#53858 — CSS order flips on client-side navigation (pages router).</p>
      <ol>
        <li>
          Open <code>/b</code> directly (full load): box is <strong>GREEN, 40px padding</strong> — correct.
        </li>
        <li>
          Go to <code>/a</code>, then click the link to <code>/b</code> (soft nav): box turns{' '}
          <strong>RED, 5px padding</strong> — broken.
        </li>
        <li>
          <code>/c</code> → <code>/d</code> is the same test with plain CSS Modules instead of vanilla-extract.
        </li>
      </ol>
    </div>
  )
}
