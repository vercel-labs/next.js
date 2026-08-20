"use server";

import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const render = (filePath) => {
  const source = fs.readFileSync(filePath, "utf8");
  return Handlebars.compile(source)({ link: "https://example.com" });
};

// Exactly what the issue reports: __dirname in production, process.cwd() in dev.
export async function renderEmailDirname() {
  const filePath = path.join(
    process.env.NODE_ENV === "development" ? process.cwd() : __dirname,
    process.env.NODE_ENV === "development" ? "lib/emails/" : "./lib/emails",
    "reset-psw-req.handlebars"
  );
  try {
    return { mode: "__dirname", dirname: __dirname, filePath, ok: true, html: render(filePath) };
  } catch (err) {
    return { mode: "__dirname", dirname: __dirname, filePath, ok: false, error: String(err?.message ?? err) };
  }
}

// Control: same read via process.cwd()
export async function renderEmailCwd() {
  const filePath = path.join(process.cwd(), "lib/emails", "reset-psw-req.handlebars");
  try {
    return { mode: "process.cwd()", cwd: process.cwd(), filePath, ok: true, html: render(filePath) };
  } catch (err) {
    return { mode: "process.cwd()", cwd: process.cwd(), filePath, ok: false, error: String(err?.message ?? err) };
  }
}
