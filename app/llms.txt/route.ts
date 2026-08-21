import { getSlugs } from '../../sanity'
export async function GET() {
  const slugs = await getSlugs()
  return new Response(`# llms\n${slugs.length}`)
}
