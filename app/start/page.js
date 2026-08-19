import Link from 'next/link'
export default function Start() {
  return (
    <main>
      <h1 id="start">Start</h1>
      <Link id="to-gated" href="/gated">Go to gated</Link>
    </main>
  );
}
