let hits = 0

export async function POST(request) {
  hits++
  const body = await request.json()
  console.log(`[graphql-endpoint] hit #${hits} query=${JSON.stringify(body.query)}`)
  return Response.json({ data: { viewer: { name: 'Ada', hits } } })
}

export async function GET() {
  return Response.json({ hits })
}
