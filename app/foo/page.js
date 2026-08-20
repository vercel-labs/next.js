import Link from 'next/link';
export default function Foo() {
  return (
    <>
      <title>Foo</title>
      <h1>Foo</h1>
      <div style={{ height: '300vh' }} />
      <Link href="/">Home</Link>{' | '}<Link href="/bar">Bar</Link>
    </>
  );
}
