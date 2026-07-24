import { Suspense } from "react";
import { connection } from "next/server";

async function ItemInner({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  return (
    <>
      <h1>Item {id}</h1>
      <p style={{ color: "#666" }}>Rendered at {new Date().toISOString()}</p>
    </>
  );
}

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main>
      <Suspense fallback={<p>loading…</p>}>
        <ItemInner params={params} />
      </Suspense>
    </main>
  );
}
