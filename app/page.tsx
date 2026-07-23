"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [result, setResult] = useState<string>("Loading...");

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setResult(JSON.stringify(data, null, 2)));
  }, []);

  return <pre>{result}</pre>;
}
