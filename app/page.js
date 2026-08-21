import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <h1>home</h1>
      <Link href="/about">about (route group)</Link>
      <Link href="/hello/foo">hello/foo (dynamic)</Link>
    </main>
  );
}
