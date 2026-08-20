import { useEffect, useState } from "react";
export default function Home() {
  const [state, setState] = useState("loading");
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/getAll");
      const text = await r.text();
      setState(`status=${r.status} body=${text}`);
    })().catch((e) => setState("error: " + e.message));
  }, []);
  return <pre id="out">{state}</pre>;
}
