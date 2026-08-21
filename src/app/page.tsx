import Link from 'next/link.js';

export default function Home() {
  return (
    <main>
      <div>Home</div>
      <Link href="/test">Test</Link>
    </main>
  );
}
