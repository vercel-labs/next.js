// Automated repro for vercel/next.js#62903
// Requires: npm i && npm run build && npm start (port 3000) and `playwright` installed.
// Also requires 127.0.0.1 tenant.localhost in /etc/hosts (Chrome resolves *.localhost automatically on most systems).
import { chromium } from "playwright";

const base = process.env.BASE || "http://tenant.localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base + "/");
await page.click("button");
await page.waitForLoadState("networkidle");
console.log("final url:", page.url());
console.log("=> check the `next start` output: the middleware log for PATH /blog");
console.log("=> reports HOST localhost:3000 (or [::]:3000 on 14.2.0-canary.0) instead of tenant.localhost:3000");
await browser.close();
