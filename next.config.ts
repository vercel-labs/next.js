import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  i18n: {
    locales: ["en-US", "nl-NL"],
    defaultLocale: "en-US",
    localeDetection: false,
    domains: [
      {
        domain: "en.example.local",
        defaultLocale: "en-US",
      },
      {
        domain: "nl.example.local",
        defaultLocale: "nl-NL",
      },
    ],
  },
}

export default nextConfig
