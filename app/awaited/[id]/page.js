// Reporter's pattern: the await happens in the page body, OUTSIDE the Suspense
// boundary, so nothing inside the boundary suspends and the fallback never shows.
import { Suspense } from "react";
import { sleep } from "../../sleep";
export const dynamic = "force-dynamic";
export default async function Page({ params }) {
  await sleep(3000); // e.g. `await db.query...`
  const data = "data for " + params.id;
  return (<div>
    <h1 id="awaited">awaited nested dynamic</h1>
    <Suspense fallback={<div id="fallback">LOADING FALLBACK (awaited nested)</div>}>
      <div id="slow-data">SLOW DATA LOADED: {data}</div>
    </Suspense>
  </div>);
}
