export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id') ?? '2'
  const res = await fetch(`http://127.0.0.1:9099/products/${id}`, {
    next: { revalidate: 5 },
  })
  const body = await res.text()
  return Response.json({ upstreamStatus: res.status, body })
}
