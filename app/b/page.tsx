import { connection } from "next/server";
import { Suspense } from "react";
import { getSharedSettings } from "../lib/cache";
import { readLateData } from "../lib/late-cache";

/** A second, unrelated route that reads the same shared cache entry. */
async function LateBox() {
  await connection();
  return <p data-testid="late">{await readLateData()}</p>;
}

export default async function PageB() {
  const settings = await getSharedSettings();
  return (
    <main>
      <h1>b</h1>
      <p data-testid="shared">{settings.title}</p>
      <Suspense fallback={<p>loading…</p>}>
        <LateBox />
      </Suspense>
    </main>
  );
}
