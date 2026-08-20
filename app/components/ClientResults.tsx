"use client";

import { useSearchParams } from "next/navigation";
import { use } from "react";

const cache = new Map<string, Promise<string>>();
function load(search: string) {
  let p = cache.get(search);
  if (!p) {
    p = new Promise<string>((r) => setTimeout(() => r(`data for "${search}"`), 1500));
    cache.set(search, p);
  }
  return p;
}

export default function ClientResults() {
  const search = useSearchParams().get("search") || "";
  const data = use(load(search));
  return <div id="results">{data}</div>;
}
