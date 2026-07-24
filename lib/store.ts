// Dependency-free server-side store: a single JSON file on disk.
//
// It is deliberately NOT a database and NOT a module-level variable — a file is
// the least-ambiguous "the server committed" evidence: the /api/state route, the
// /status Server Component, and the Server Action all read the same bytes, so if
// the file says "ready" the mutation is on the server, full stop. The bug is that
// the browser UI can fail to reflect that committed value.
import { promises as fs } from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), ".data", "status.json");

export type Status = "draft" | "ready";

export async function readStatus(): Promise<Status> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as { status?: Status };
    return parsed.status === "ready" ? "ready" : "draft";
  } catch {
    // No file yet → the world starts in "draft".
    return "draft";
  }
}

export async function writeStatus(status: Status): Promise<void> {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify({ status }), "utf8");
}
