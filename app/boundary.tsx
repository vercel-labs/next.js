"use client";
import { use } from "react";

export function Boundary({ dataPromise }: { dataPromise: Promise<any> }) {
  const bootstrap = use(dataPromise);
  return (
    <div id="resolved">
      RESOLVED records={bootstrap.response.length} key={bootstrap.key}
    </div>
  );
}
