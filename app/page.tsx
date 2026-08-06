import { headers } from "next/headers";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense>
      <Test />
    </Suspense>
  );
}

async function Test() {
  await headers();
  return <div>Home</div>;
}
