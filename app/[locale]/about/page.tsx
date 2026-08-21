import Link from 'next/link';

export default function About() {
  return (
    <>
      <h1 id="about">About page (html/body come from app/[locale]/layout.tsx)</h1>
      {/* Prefetching an unmatched route makes Next render app/not-found.tsx,
          which lives under the root layout that has no <html>/<body>. */}
      <Link href="/nope">missing route</Link>
    </>
  );
}
