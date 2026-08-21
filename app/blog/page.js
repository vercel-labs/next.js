import Link from 'next/link';
export default function Blog() {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        <li><Link id="auto" href="/blog/post-1">post-1 (auto prefetch)</Link></li>
        <li><Link id="true" href="/blog/post-1" prefetch={true}>post-1 (prefetch true)</Link></li>
        <li><Link id="auto2" href="/blog/post-1">post-1 (auto prefetch 2)</Link></li>
      </ul>
    </div>
  );
}
