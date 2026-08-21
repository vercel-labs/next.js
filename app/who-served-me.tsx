"use client";

import { useState } from "react";
import { whoServedMe } from "./actions";

export function WhoServedMe() {
  const [result, setResult] = useState<string>("");
  return (
    <p>
      <button onClick={async () => setResult(JSON.stringify(await whoServedMe()))}>
        Run Server Action
      </button>{" "}
      <span id="action-result">{result}</span>
    </p>
  );
}
