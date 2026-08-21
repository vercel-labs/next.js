import Link from 'next/link';

export default function Page() {
  return (
    <>
      <title>Metadata: Page</title>
      <meta name="description" content="Inline page description" />
      <h1>Page</h1>
      <Link href="/test">To Test Page</Link>
    </>
  );
}
