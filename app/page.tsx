import Link from 'next/link';
export default function Home() {
  return (<div>
    <h1>home</h1>
    <Link href="/blog" id="to-blog">to /blog</Link>{' '}
    <Link href="/blog/singleton" id="to-slug">to /blog/singleton (prefetch on)</Link>{' '}
    <Link href="/blog/nopf" id="to-slug-np" prefetch={false}>to /blog/nopf (prefetch off)</Link>{' '}
    <Link href="/c/us/ca/sf" id="to-sf-np" prefetch={false}>to /c/us/ca/sf (prefetch off)</Link>
  </div>);
}
