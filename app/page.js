import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      {[1, 2, 3].map((id) => (
        <Link key={id} id={`link-${id}`} href={`/photo/${id}`}>photo {id}</Link>
      ))}
    </main>
  );
}
