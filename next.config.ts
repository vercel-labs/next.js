import type { NextConfig } from "next";

const experimentalCpus = process.env.NEXT_EXPERIMENTAL_CPUS
  ? Number.parseInt(process.env.NEXT_EXPERIMENTAL_CPUS, 10)
  : undefined;
const reactCompilerEnabled = process.env.REPRO_REACT_COMPILER !== "false";

const nextConfig: NextConfig = {
  reactCompiler: reactCompilerEnabled,
  experimental: {
    ...(experimentalCpus ? { cpus: experimentalCpus } : {}),
    turbopackRustReactCompiler: reactCompilerEnabled,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
