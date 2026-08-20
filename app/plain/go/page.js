import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default function Go() {
  const s = 'plain' + Date.now();
  return (
    <div>
      <h1 id="go">go</h1>
      <Link id="no-prefetch" href={`/plain/publication/${s}/a`} prefetch={false}>np</Link>
      <br/>
      <Link id="with-prefetch" href={`/plain/publication/${s}/b`}>wp</Link>
    </div>
  );
}
