"use client";

import { cookieReproAction } from "./actions";

export default function Home() {
  return (
    <button id="run" onClick={() => { cookieReproAction(); }}>
      Run repro
    </button>
  );
}
