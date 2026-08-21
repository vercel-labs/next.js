import { reportUseCache } from "@/lib/use-cache";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await reportUseCache());
}
