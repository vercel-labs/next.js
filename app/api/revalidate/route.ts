import { revalidateTag } from 'next/cache'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const tag = new URL(req.url).searchParams.get('tag')!
  revalidateTag(tag)
  return Response.json({ revalidated: tag, now: new Date().toISOString() })
}
