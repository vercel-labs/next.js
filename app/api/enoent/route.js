// Minimal version of the original report: a module-scope error with code ENOENT.
// Next.js 14.0.3 turned this into a silent 404. Latest canary returns 500 + logs it.
const err = new Error("test");
err.code = "ENOENT";
throw err;

export async function GET() {
  return Response.json({ message: "ok" });
}
