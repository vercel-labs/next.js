import { Suspense } from "react";
import { makeDataset } from "../data";
import { Boundary } from "../boundary";
import { HydrationMarker } from "../hydrated";



function later<T>(v: () => T, ms: number) {
  return new Promise<T>((r) => setTimeout(() => r(v()), ms));
}
function race<T>(p: Promise<T>) {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error("timeout")), 30000)),
  ]);
}

export default async function Page() {
  const small1 = race(later(() => makeDataset(2), 500)).then((response) => ({ id: "a", key: "a", response }));
  const small2 = race(later(() => makeDataset(3), 1200)).then((response) => ({ id: "b", key: "b", response }));
  const big = race(later(() => makeDataset(Number(process.env.RECORD_COUNT ?? 700)), Number(process.env.DELAY_MS ?? 2500))).then(
    (response) => ({ id: "c", key: "big", response })
  );
  small1.catch(() => {});
  small2.catch(() => {});
  big.then((v) => console.log("[server] big settled", v.response.length));
  return (
    <main>
      <h1>multi</h1>
      <HydrationMarker />
      <Suspense fallback={<div>s1</div>}>
        <Boundary dataPromise={small1} />
      </Suspense>
      <Suspense fallback={<div>s2</div>}>
        <Boundary dataPromise={small2} />
      </Suspense>
      <Suspense fallback={<div id="fallback">SKELETON</div>}>
        <Boundary dataPromise={big} />
      </Suspense>
    </main>
  );
}
