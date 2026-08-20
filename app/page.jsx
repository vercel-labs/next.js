import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 id="home">Home page</h1>
      <Link href="/source" id="to-source">
        Go to /source (server component that redirect()s to /target)
      </Link>
    </div>
  );
}
