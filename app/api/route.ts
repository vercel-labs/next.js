export const dynamic = 'force-dynamic'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: Request) {
  await sleep(3000) // deterministic 3s
  const { searchParams } = new URL(request.url)
  return Response.json({ key: searchParams.get('key') })
}
