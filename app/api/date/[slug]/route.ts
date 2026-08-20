export const dynamic = 'force-dynamic'
export async function GET(_req: Request, ctx: { params: { slug: string } }) {
  return Response.json({ slug: ctx.params.slug, date: new Date().toISOString() })
}
