"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Body() {
  const params = useSearchParams();
  return (
    <>
      <h1>Page 2</h1>
      <Link href={`/app/page1?${params.toString()}&abc=123`}>
        Go back to page 1
      </Link>
    </>
  );
}
