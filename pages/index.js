import Link from 'next/link';
export default function Home() {
  return (
    <div>
      <h1 id="home">Home</h1>
      <Link id="to-ssg" href="/ssg">SSG</Link><br/>
      <Link id="to-post" href="/blog/a">Post</Link><br/>
      <Link id="to-ssr" href="/ssr" prefetch={false}>SSR</Link>
    </div>
  );
}
