import { value } from "../../../lib/value";
export const dynamic = "force-dynamic";
export function GET() {
  console.log("[app/api/global] global.cachedValue:", global.cachedValue, "module value:", value, "pid:", process.pid);
  return Response.json({ global: global.cachedValue, value, pid: process.pid });
}
