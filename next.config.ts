import type { NextConfig } from "next";

// Mirrors the relevant settings from apps/ecommerce/next.config.ts in the
// private monorepo (stripped of internal dependencies: Sentry, Payload,
// BotId, next-intl, bundle-analyzer, custom image loader, rewrites/redirects).

const config: NextConfig = {
    adapterPath: new URL("./adapter.mjs", import.meta.url).pathname,
    logging: {
        incomingRequests: true,
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    reactCompiler: true,
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000", "*.vercel.app"],
        },
        staticGenerationRetryCount: 10,
    },
    trailingSlash: false,
    skipTrailingSlashRedirect: true,
    reactStrictMode: true,
    staticPageGenerationTimeout: 600,
};

export default config;
