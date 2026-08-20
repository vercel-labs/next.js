import jsonpath from "jsonpath";

// Uncomment to work around the bug:
// export const runtime = "edge";

export function GET() {
  const value = jsonpath.query({ a: { b: "value" } }, "a.b");
  return Response.json({ success: true, value });
}
