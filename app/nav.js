'use client';
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/a/">a</Link> | <Link href="/b/">b</Link> | <Link href="/c/">c</Link> | <Link href="/d/">d</Link> | <Link href="/e/">e</Link>
    </nav>
  );
}
