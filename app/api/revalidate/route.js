import { revalidateTag } from "next/cache";
export async function GET() { revalidateTag("current-time"); return new Response(null, { status: 204 }); }
