"use client";
import { startStream, startStreamNoStore } from "./action";
export default function Home() {
  return (
    <div>
      <button id="default" onClick={() => startStream()}>Start Stream</button>
      <button id="nostore" onClick={() => startStreamNoStore()}>Start Stream (no-store)</button>
    </div>
  );
}
