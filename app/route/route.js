export const dynamic = 'force-dynamic'
export async function GET(request) {
  console.log('ROUTE HANDLER CALLED', new URL(request.url).search || '(no query)', 'rsc-header=' + (request.headers.get('rsc') ?? 'none'))
  return new Response('route handler response')
}
