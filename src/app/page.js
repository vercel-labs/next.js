import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link id="to-art" href="/picasso/guernica">art page</Link>
    </div>
  );
}
