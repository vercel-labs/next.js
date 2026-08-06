import Link from 'next/link';

export default function About() {
  return (
    <main style={{ padding: '80px 16px' }}>
      <h1>About</h1>
      <p>
        Expected: this page opens at the top. Actual on 16.3.0: it opens at the scroll offset
        carried over from the previous page.
      </p>
      <div style={{ height: 4000, background: 'linear-gradient(#e8f0ff, #b9ccf0)' }} />
      <Link href="/" style={{ fontSize: 24 }}>
        back to /
      </Link>
      <div style={{ height: 600 }} />
    </main>
  );
}
