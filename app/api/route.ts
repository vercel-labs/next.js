// App Router Route Handler. `revalidate` must be `false | 0 | number`,
// so `"asdf"` is invalid -- but the Next.js TS plugin reports nothing here.
export const revalidate = "asdf";
export const dynamic = "asdf";

export function GET() {
  return Response.json({ ok: true });
}
