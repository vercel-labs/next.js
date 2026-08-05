"use client";

import { useEffect, useState } from "react";

// Mirrors a real app: client component polling an API route while the page is open.
export function Poller() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/ping")
        .then(() => setCount((current) => current + 1))
        .catch(() => {});
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>client poller: {count}</p>;
}
