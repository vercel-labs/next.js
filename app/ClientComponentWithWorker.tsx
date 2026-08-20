"use client";

import { useEffect, useState } from "react";

export function ClientComponentWithWorker() {
  const [result, setResult] = useState(0);
  useEffect(() => {
    const worker = new Worker(new URL("./worker.js", import.meta.url));

    worker.postMessage(10);

    worker.onmessage = (event) => {
      setResult(event.data);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <div>
      <h1>Web Worker Example</h1>
      <p>Result: {result}</p>
    </div>
  );
}
