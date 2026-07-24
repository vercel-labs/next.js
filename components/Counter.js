"use client";
import { useState } from "react";
export function Counter() {
  const [n, setN] = useState(0);
  return <button id="counter" onClick={() => setN(v => v + 1)}>clicked {n} times</button>;
}
