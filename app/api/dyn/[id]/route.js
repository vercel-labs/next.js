import { value } from "../../../../lib/value";
export const dynamic = "force-dynamic";
export async function GET(_req, ctx) {
  const { id } = await ctx.params;
  console.log("[app/api/dyn]", id, "global.cachedValue:", global.cachedValue, "module value:", value, "pid:", process.pid);
  return Response.json({ id, global: global.cachedValue, value, pid: process.pid });
}
