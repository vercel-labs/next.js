import { useEffect } from "react";
import { boom } from "../lib/boom";

export default function Home() {
  useEffect(() => {
    try {
      boom();
    } catch (err) {
      // Line numbers/files printed here should map back to lib/boom.ts / pages/index.tsx
      console.log("CAUGHT_STACK_START");
      console.log((err as Error).stack);
      console.log("CAUGHT_STACK_END");
    }
  }, []);
  return <p>see the browser console</p>;
}
