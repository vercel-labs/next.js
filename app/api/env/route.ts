export const dynamic = 'force-dynamic'
export async function GET() {
  return Response.json({
    NEXT_PUBLIC_MY_VAR: process.env.NEXT_PUBLIC_MY_VAR ?? null,
    MY_VAR: process.env.MY_VAR ?? null,
  })
}
