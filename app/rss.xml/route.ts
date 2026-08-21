import { getSlugs } from '../../sanity'
export async function GET() {
  const slugs = await getSlugs()
  return new Response(`<rss>${slugs.length}</rss>`, { headers: { 'content-type': 'application/xml' } })
}
