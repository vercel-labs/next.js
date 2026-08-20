"use client";
import { useState } from "react";
import { renderEmailDirname, renderEmailCwd } from "./actions";

export default function Page() {
  const [out, setOut] = useState("");
  const run = async (fn) => {
    const r = await fn();
    setOut(JSON.stringify(r, null, 2));
    if (!r.ok) console.error("server action failed:", r.error);
  };
  return (
    <main style={{ fontFamily: "monospace", padding: 24 }}>
      <h1>next#71358 — fs.readFileSync of a .handlebars template in a Server Action</h1>
      <button id="run" onClick={() => run(renderEmailDirname)}>read via __dirname (issue repro)</button>{" "}
      <button id="run-cwd" onClick={() => run(renderEmailCwd)}>read via process.cwd()</button>
      <pre id="out">{out}</pre>
    </main>
  );
}
