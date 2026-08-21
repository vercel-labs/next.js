import { Suspense } from "react";
import Link from "next/link";
import { Log } from "./Log";

async function Child({ mode, ms }) {
  if (mode === "fetch") {
    // uncached network request on the server
    await fetch("https://example.com/?t=" + Date.now(), { cache: "no-store" });
  } else {
    await new Promise((r) => setTimeout(r, ms));
  }
  return <Log name="ClientComponent" />;
}

export default async function Page({ searchParams }) {
  const sp = await searchParams;
  const mode = sp.mode ?? "none";
  const ms = Number(sp.ms ?? 0);
  return (
    <>
      <Link prefetch={false} href="/?mode=fetch">fetch</Link>{" | "}
      <Link prefetch={false} href="/?mode=timeout&ms=50">timeout 50</Link>{" | "}
      <Link prefetch={false} href="/?mode=timeout&ms=1000">timeout 1000</Link>
      <Suspense key={mode + ms} fallback={<Log name="SuspenseComponent" />}>
        <Child mode={mode} ms={ms} />
      </Suspense>
    </>
  );
}
