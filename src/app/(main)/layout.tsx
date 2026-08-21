import Link from 'next/link';

export default function MainGroupLayout({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb: React.ReactNode;
}) {
  return (
    <div className="p-4">
      <header className="mb-8 pb-4 border-b">
        <h2 className="text-xl font-semibold">(Main) Group Layout</h2>
        <div className="mt-2">{breadcrumb}</div>
        <nav className="mt-4 space-x-4">
          <Link href="/" className="text-blue-600 hover:underline">
            Root Home
          </Link>
          <Link href="/main-group-page" className="text-blue-600 hover:underline">
            (Main) Group Home
          </Link>
          <Link href="/exists" className="text-blue-600 hover:underline">
            /exists
          </Link>
          <Link href="/does-not-exist" className="text-blue-600 hover:underline">
            /does-not-exist (404 test)
          </Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
