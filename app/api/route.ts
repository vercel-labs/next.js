import { NextRequest } from 'next/server'

// A dynamic route handler we only want in SSR builds; with `output: 'export'`
// there is no way to exclude it, so the build fails.
export async function GET(request: NextRequest) {
  return new Response(JSON.stringify({ url: request.url }), {
    headers: { 'content-type': 'application/json' },
  })
}

// Next 14 workaround: adding a POST used to exclude the route from export builds.
// It no longer works.
export async function POST() {
  return new Response('ok')
}
