"use client";
import { useState, useEffect } from "react";
export default function Counter() {
  const [n, setN] = useState(0);
  useEffect(() => { document.documentElement.dataset.hydrated = "yes"; }, []);
  return (<button id="counter" onClick={() => setN(n + 1)}>count: {n}</button>);
}
