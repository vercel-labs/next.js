"use client";

import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <button id="sync" onClick={() => redirect("/target")}>
        Redirect
      </button>
      <button id="async" onClick={async () => redirect("/target")}>
        Redirect Async
      </button>
    </main>
  );
}
