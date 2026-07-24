import { connection } from "next/server";
import { readStatus } from "@/lib/store";

// The proof endpoint: returns the raw server-side status. `await connection()`
// keeps it per-request (never cached). When the UI is stuck on "draft" but this
// returns "ready", the mutation demonstrably committed on the server and only the
// browser view is stale.
export async function GET() {
  await connection();
  const status = await readStatus();
  return Response.json({ status });
}
