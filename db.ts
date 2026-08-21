import { readFileSync, writeFileSync } from "node:fs";
const file = process.cwd() + "/db.json";
export function read(): Record<string, { id: string; name: string }> {
  return JSON.parse(readFileSync(file, "utf8"));
}
export function write(db: Record<string, unknown>) {
  writeFileSync(file, JSON.stringify(db));
}
