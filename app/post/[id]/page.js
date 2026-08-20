import { Suspense } from "react";
import Slow from "../../slow";
export const dynamic = "force-dynamic";
export default function Page({ params }) {
  return (<div>
    <h1 id="post">post {params.id}</h1>
    <Suspense fallback={<div id="fallback">LOADING FALLBACK (nested dynamic)</div>}>
      <Slow label={"post " + params.id} />
    </Suspense>
  </div>);
}
