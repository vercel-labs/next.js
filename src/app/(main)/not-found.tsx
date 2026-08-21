"use client";

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center mt-12">
      <h1 className="text-2xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4">The page you are looking for within the (main) group does not exist.</p>
      <div className="mt-6 space-x-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Go back to Root Home
        </Link>
        <Link href="/main-group-page" className="text-blue-600 hover:underline">
          Go back to (Main) Group Home
        </Link>
      </div>
    </div>
  );
}
