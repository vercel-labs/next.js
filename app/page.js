import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <h1 id="home">Home</h1>
      <Link id="link-1" href="/photo/1">Image 1</Link>
    </main>
  );
}
