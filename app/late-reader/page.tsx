import { connection } from "next/server";
import { Suspense } from "react";
import { readLateData } from "../lib/late-cache";

/**
 * A plain reader of the `late-data` cache entry. This route never fills the
 * entry under adverse timing -- it only ever reads it, at request time.
 *
 * `connection()` keeps the read out of the build-time static shell, so what
 * you see here is always the *current* state of the cache entry. If this
 * starts failing with `Error: Connection closed.`, the entry itself is
 * corrupt.
 */
async function LateBox() {
  await connection();
  return <p data-testid="late">{await readLateData()}</p>;
}

export default function LateReader() {
  return (
    <main>
      <h1>late-reader</h1>
      <Suspense fallback={<p>loading…</p>}>
        <LateBox />
      </Suspense>
    </main>
  );
}
