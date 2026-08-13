import { Suspense } from "react";
import { makeDataset } from "./data";
export const dynamic = "force-dynamic";
import { Boundary } from "./boundary";
import { HydrationMarker } from "./hydrated";



const COUNT = Number(process.env.RECORD_COUNT ?? 700);
const DELAY = Number(process.env.DELAY_MS ?? 2000);

function fetchLargeDataset() {
  return new Promise<ReturnType<typeof makeDataset>>((resolve) => {
    setTimeout(() => resolve(makeDataset(COUNT)), DELAY);
  });
}

function withTimeoutRace<T>(p: Promise<T>) {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 30000)
    ),
  ]);
}

export default async function Page() {
  const dataPromise = withTimeoutRace(fetchLargeDataset()).then((response) => ({
    id: "envelope",
    key: "bootstrap",
    response,
  }));
  dataPromise.then((v) =>
    console.log("[server] promise settled, records:", v.response.length)
  );
  return (
    <main>
      <h1>repro 97293</h1>
      <HydrationMarker />
      <p>
        records={COUNT} delay={DELAY}ms
      </p>
      <Suspense fallback={<div id="fallback">SKELETON</div>}>
        <Boundary dataPromise={dataPromise} />
      </Suspense>
    </main>
  );
}
