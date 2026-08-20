import Link from 'next/link';

export default async function BlogPost({ params }) {
  const { id } = await params;
  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1 id="post-title">Post {id}</h1>
      <Link href="/">Home</Link>
    </main>
  );
}
