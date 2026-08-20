import Link from 'next/link';
export default async function BlogPage() {
  await new Promise((r) => setTimeout(r, 2000));
  return (<div><h1 id="blog-page">blog index</h1>
    <Link href="/blog/singleton" id="to-slug">to /blog/singleton</Link></div>);
}
