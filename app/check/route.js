export const dynamic = 'force-dynamic'

export async function GET(request) {
  const headers = Object.fromEntries(request.headers.entries())
  console.log('[repro] /check received headers:', JSON.stringify(headers))
  return Response.json({ headers })
}
