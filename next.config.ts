import { NextConfig } from "next";

// Reproduction for https://github.com/vercel/next.js/issues/73801
// Original repro used `experimental.ppr: true` (now `experimental.cacheComponents`).
// Both were tested on Next 16.3.1-canary.25; see README.md.
export default {} satisfies NextConfig;
