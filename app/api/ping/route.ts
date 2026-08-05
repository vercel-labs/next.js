export function GET() {
  return Response.json({ ok: true, at: Date.now() });
}
