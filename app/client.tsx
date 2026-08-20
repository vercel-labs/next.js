"use client";

import { startTransition, useState, useTransition } from "react";
import { addItem } from "./actions";

export default function Client({ id }: { id: string }) {
  const [log, setLog] = useState<string[]>([]);
  const [isPending, start] = useTransition();

  return (
    <main>
      <h1>server action invocation</h1>
      {/* module-level startTransition, sync callback returning a promise */}
      <button id="a" onClick={() => startTransition(() => { addItem(id).then((r) => setLog((l) => [...l, "a:" + r])); })}>
        A: startTransition sync
      </button>
      {/* async callback passed to startTransition (React 19) */}
      <button id="b" onClick={() => startTransition(async () => { const r = await addItem(id); setLog((l) => [...l, "b:" + r]); })}>
        B: startTransition async
      </button>
      {/* useTransition startTransition with async callback */}
      <button id="c" onClick={() => start(async () => { const r = await addItem(id); setLog((l) => [...l, "c:" + r]); })}>
        C: useTransition async
      </button>
      {/* no transition at all */}
      <button id="d" onClick={async () => { const r = await addItem(id); setLog((l) => [...l, "d:" + r]); }}>
        D: no transition
      </button>
      <p id="pending">{isPending ? "pending" : "idle"}</p>
      <pre id="log">{log.join("\n")}</pre>
    </main>
  );
}
