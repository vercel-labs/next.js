import type { NextConfig } from "next";

const experimentalCpus = process.env.NEXT_EXPERIMENTAL_CPUS
  ? Number.parseInt(process.env.NEXT_EXPERIMENTAL_CPUS, 10)
  : undefined;
const reactCompilerEnabled = process.env.REPRO_REACT_COMPILER !== "false";
const webpackEnabled = process.env.REPRO_BUNDLER === "webpack";

const nextConfig: NextConfig = {
  reactCompiler: reactCompilerEnabled,
  experimental: {
    ...(experimentalCpus ? { cpus: experimentalCpus } : {}),
    ...(!webpackEnabled
      ? { turbopackRustReactCompiler: reactCompilerEnabled }
      : { webpackMemoryOptimizations: true }),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
