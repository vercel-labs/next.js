export const dynamic = 'force-dynamic'
export async function GET(request) {
  const u = new URL(request.url)
  return Response.json({ route: 'app/api/route-handler', url: request.url, search: u.search })
}
