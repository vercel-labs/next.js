import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  experimental: {
    turbopackSourceMaps: true,
    turbopackInputSourceMaps: true,
  },
};

export default withSentryConfig(baseConfig, {
  silent: true,
  telemetry: false,
  sourcemaps: { disable: false },
});
