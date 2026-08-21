let count = 0

export async function GET() {
  count++
  console.log('[api/data] request #' + count)
  return Response.json({ count })
}
