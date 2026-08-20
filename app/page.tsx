import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link href="/redirect">/redirect</Link>
      <Link href="/does-not-exist">/does-not-exist</Link>
    </main>
  );
}
