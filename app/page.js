import Link from 'next/link';
export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <div style={{ height: '300vh' }} />
      <Link href="/foo">Foo</Link>{' | '}<Link href="/bar">Bar</Link>
    </>
  );
}
