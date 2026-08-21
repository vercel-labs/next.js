/** @type {import('next').NextConfig} */
const config = {
  // The ONLY lever that changes the outcome is worker COUNT (experimental.cpus,
  // set here via BUILD_CPUS for the README matrix). Worker MEMORY is uncontrollable:
  // NODE_OPTIONS --max-old-space-size is stripped from workers
  // (packages/next/src/lib/worker.ts — isolatedMemory deletes the flag).
  experimental: {
    cpus: process.env.BUILD_CPUS ? Number(process.env.BUILD_CPUS) : undefined,
  },
};
export default config;
