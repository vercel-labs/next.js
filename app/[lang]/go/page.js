import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default function Go() {
  const s = 'fresh' + Date.now();
  return (
    <div>
      <h1 id="go">go</h1>
      <Link id="no-prefetch" href={`/en/publication/${s}/a`} prefetch={false}>np</Link><br/>
      <Link id="with-prefetch" href={`/en/publication/${s}/b`}>wp</Link><br/>
      <Link id="slow-np" href="/en/slow" prefetch={false}>slow np</Link>
    </div>
  );
}
