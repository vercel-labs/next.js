"use client";

import Link from "next/link";

export default function Second() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Page 2</h1>
      <Link href="/">Back to page 1</Link>
    </main>
  );
}
