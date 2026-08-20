import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link id="to-about" href="/about">
        Go to /about
      </Link>
    </main>
  );
}
