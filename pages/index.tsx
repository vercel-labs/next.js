import dynamic from "next/dynamic";

// Fully-specified ESM import path with .js extension resolving Button.tsx
const Button = dynamic(() => import("./Button.js"), { ssr: false });

export default function Home() {
  return (
    <main>
      <h1 id="title">repro 46678</h1>
      <Button />
    </main>
  );
}
