import React from "react";
import Link from "next/link";
import { headers } from "next/headers";

export default async function Page(props: {
  searchParams: Promise<{
    section: string;
  }>;
}) {
  console.log("Page");
  const headersList = await headers();
  const searchParams = await props.searchParams;
  console.log("searchParams", searchParams);
  const section = searchParams.section;
  return (
    <div>
      <div>
        <Link href={`link2?q=1`} prefetch={false}>Link 2 - 1</Link>
      </div>
      <div>
        <Link href={`link2?q=2`} prefetch={false}>Link 2 - 2</Link>
      </div>
      <div>
        <Link href={`link2`} prefetch={false}>Link 2 - 3</Link>
      </div>
    </div>
  );
}
