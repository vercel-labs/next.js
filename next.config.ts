import type { NextConfig } from "next";

const config: NextConfig = {
  cacheComponents: true,
  // Forces >1 build/export worker regardless of host CPU count.
  // The bug only appears when static generation runs in multiple workers.
  experimental: { cpus: 8 },
};

export default config;
