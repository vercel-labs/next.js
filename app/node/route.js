export const dynamic = 'force-dynamic'
export async function GET() {
  return Response.json({
    runtime: 'nodejs',
    MY_SECRET: process.env.MY_SECRET ?? null,
    MY_SECRET_dynamic: process.env['MY_SECRET'] ?? null,
    NEXT_PUBLIC_MY_PUBLIC: process.env.NEXT_PUBLIC_MY_PUBLIC ?? null,
    VERCEL: process.env.VERCEL ?? null,
  })
}
