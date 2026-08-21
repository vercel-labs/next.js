import { withSentryConfig } from "@sentry/nextjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  typedRoutes: true,
  i18n: {
    locales: ["en", "pt-BR"],
    defaultLocale: "pt-BR",
  },
  outputFileTracingExcludes: {
    "*": ["**swc/core**"],
  },
};

const sentryBuildOptions = {
  silent: true,
};

export default withSentryConfig(config, sentryBuildOptions);
