import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>home</h1>
      <Link id="to-photo" href="/photo/1">
        open photo 1
      </Link>
    </main>
  );
}
