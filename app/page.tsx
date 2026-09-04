"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Page 1</h1>
      <p>Open DevTools console, then click the link below.</p>
      <Link href="/second">Go to page 2 (client navigation)</Link>
    </main>
  );
}
