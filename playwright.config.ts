import { defineConfig } from "@playwright/test";

const useWebpack = process.env.NEXT_BUNDLER === "webpack";

export default defineConfig({
  testDir: "./tests",
  reporter: "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  webServer: {
    command: useWebpack ? "npm run dev:webpack" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
