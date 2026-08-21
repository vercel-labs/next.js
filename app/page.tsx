"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "monospace", padding: 20 }}>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <p>On iOS 15 Safari the bundle fails to parse, so this button does nothing.</p>
    </div>
  );
}
