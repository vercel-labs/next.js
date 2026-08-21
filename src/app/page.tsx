import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-2xl font-bold mb-8">Root Home Page</h1>
      <div className="space-y-2">
        <p>
          <Link href="/main-group-page" className="text-blue-600 hover:underline">
            Go to (Main) Group Home Page (/main-group-page)
          </Link>
        </p>
        <p>
          <Link href="/exists" className="text-blue-600 hover:underline">
            Go to /exists (should work)
          </Link>
        </p>
        <p>
          <Link href="/does-not-exist" className="text-blue-600 hover:underline">
            Go to /does-not-exist (should be 404)
          </Link>
        </p>
      </div>
    </main>
  );
}
