export const dynamic = 'force-static'
export async function GET() {
  return new Response(null, { status: 205 })
}
