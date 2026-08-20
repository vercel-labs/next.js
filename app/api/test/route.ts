export const dynamic = 'force-dynamic'
export async function GET() {
  return Response.json({ text: 'This is data fetched from API' })
}
