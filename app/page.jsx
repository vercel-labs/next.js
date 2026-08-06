import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '80px 16px' }}>
      <h1>Home</h1>
      <p>Scroll to the bottom, then follow the link.</p>
      <div style={{ height: 4000, background: 'linear-gradient(#eee, #ccc)' }} />
      <Link href="/about" style={{ fontSize: 24 }}>
        go to /about
      </Link>
      <div style={{ height: 600 }} />
    </main>
  );
}
