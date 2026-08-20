export const runtime = "edge";
export const dynamic = "force-dynamic";
export function GET() {
  globalThis._edge ??= Math.random().toString(36).slice(2, 8);
  console.log("[edge] globalThis._edge:", globalThis._edge);
  return Response.json({ edge: globalThis._edge });
}
// e
