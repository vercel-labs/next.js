"use client";

import { action } from "./action";

/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  const onclick = async () => {
    await action();
  };
  return (
    <button onClick={onclick}>Execute Server Actions</button>
  )
}
