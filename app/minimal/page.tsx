import { Suspense } from "react";
import { connection } from "next/server";
import { headers } from "next/headers";

export async function generateMetadata() {
  await connection();
  return { title: "minimal" };
}

async function Dyn() {
  const h = await headers();
  return <p>ua: {String(h.get("user-agent")).slice(0, 20)}</p>;
}

export default function Page() {
  return (
    <main>
      <h1>static shell</h1>
      <Suspense fallback={<div>loading…</div>}>
        <Dyn />
      </Suspense>
    </main>
  );
}
