import { merge } from "ts-deepmerge";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(merge({ a: 1 }, { b: 2 }));
}
