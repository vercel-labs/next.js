import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/time'
  revalidatePath(path)
  return Response.json({ revalidated: path, now: Date.now() })
}
