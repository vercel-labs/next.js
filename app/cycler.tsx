"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Cycler() {
  const router = useRouter();
  const pathname = usePathname();
  const current = parseInt(pathname.split("/").pop() || "1", 10);
  const [len, setLen] = useState(0);

  useEffect(() => {
    setLen(history.length);
    const interval = setInterval(() => {
      router.push(`/dog/${current === 3 ? 1 : current + 1}`);
    }, 3000);
    return () => clearInterval(interval);
  }, [current, router]);

  return (
    <main>
      <h1>Dog {current}</h1>
      <p>
        pathname: <code>{pathname}</code> — history.length: <code>{len}</code>
      </p>
      <p>Auto-pushes the next dog every 3 seconds. Now press the browser back button.</p>
    </main>
  );
}
