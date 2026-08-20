import { Suspense } from "react";
import Slow from "../slow";
export const dynamic = "force-dynamic";
export default function Page() {
  return (<div>
    <h1 id="flat">flat route</h1>
    <Suspense fallback={<div id="fallback">LOADING FALLBACK (flat)</div>}>
      <Slow label="flat" />
    </Suspense>
  </div>);
}
