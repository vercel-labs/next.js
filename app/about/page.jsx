import Link from 'next/link';

export default function About() {
  return (
    <main>
      <h1>About</h1>
      <Link id="to-home" href="/">
        Go to /
      </Link>
    </main>
  );
}
