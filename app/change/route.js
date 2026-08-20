import cache from "../../lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("[app/change/route] setting id to 3");
  cache.setId("3");
  return new Response("app route handler set id to 3");
}
