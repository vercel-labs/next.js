import Link from 'next/link';
export default function Bar() {
  return (
    <div>
      <title>Bar</title>
      <h1>Bar</h1>
      <div style={{ height: '300vh' }} />
      <Link href="/">Home</Link>{' | '}<Link href="/foo">Bar-to-Foo</Link>
    </div>
  );
}
