import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./i18n/request.ts",
});

export default withNextIntl(nextConfig);

initOpenNextCloudflareForDev();
