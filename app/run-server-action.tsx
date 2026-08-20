"use client";

import { useState } from "react";
import { testServerAction } from "./actions";

export default function RunServerAction() {
  const [result, setResult] = useState("idle");
  return (
    <main>
      <button
        id="run"
        onClick={async () => {
          try {
            setResult(await testServerAction());
          } catch (err) {
            setResult("ERROR: " + (err as Error).message);
          }
        }}
      >
        run server action
      </button>
      <pre id="result">{result}</pre>
    </main>
  );
}
