import Link from 'next/link';

export default async function Home() {
  return (
    <div style={{ height: 4000, background: 'linear-gradient(#fff, #cfc)' }}>
      <h1 id="home-title">Home (4000px tall) — rendered at {new Date().toISOString()}</h1>
      <div style={{ position: 'absolute', top: 3900 }}>
        <Link id="to-page2" href="/page2">Go to Page2 (bottom of Home)</Link>
      </div>
    </div>
  );
}
