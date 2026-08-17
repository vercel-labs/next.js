import { revalidateTag } from 'next/cache'
import { connection } from 'next/server'

export async function GET() {
  await connection()

  revalidateTag('products', { expire: 0 })

  return Response.json({ revalidated: true })
}
