import { revalidateTag } from "next/cache";

/**
 * Stand-in for a mutation that invalidates a cache tag. (`updateTag` is only
 * callable from a Server Action; `revalidateTag` has the same effect on the
 * cache entry and is reachable from a script.)
 */
export async function POST(request: Request) {
  const tag = new URL(request.url).searchParams.get("tag") ?? "late-data";
  revalidateTag(tag, { expire: 0 });
  return Response.json({ ok: true, tag });
}
