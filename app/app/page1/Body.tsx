"use client";

import Link from "next/link";

export default function Body() {
  return (
    <>
      <h1>Page 1</h1>
      <Link href="/app/page2?foo=bar">Click me to go to page 2</Link>
    </>
  );
}
