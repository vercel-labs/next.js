import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <h1 id="not-found-boundary">route not-found boundary</h1>
      <Link href="/">home</Link>
    </main>
  );
}
