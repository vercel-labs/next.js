"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [t, setT] = useState("");
  useEffect(() => {
    setTimeout(() => {
      document.title = "Client page title";
    }, 1);
    const id = setInterval(() => setT(document.title), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      {/* React 19 hoisted title from a client page */}
      <title>Testing</title>
      <p id="observed">document.title is now: {t}</p>
    </div>
  );
}
