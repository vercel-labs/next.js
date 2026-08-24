export const dynamic = "force-dynamic";

// Two dynamic imports of the SAME module with two different query strings whose
// 7-base38-char truncated ident hash (turbopack-core/src/ident.rs) is identical:
// both chunks are emitted as .next/server/chunks/src_gen_m_1u45-ck.js
export async function GET(request) {
  const n = Number(new URL(request.url).searchParams.get("n") ?? "0");
  if (n === 0) return Response.json({ v: (await import("../../../gen/m.js?q73518")).v });
  return Response.json({ v: (await import("../../../gen/m.js?q102901")).v });
}
