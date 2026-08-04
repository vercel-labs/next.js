export async function getMdxContent(slug: string) {
  'use cache'

  const { default: Content } = await import(`../content/${slug}.mdx`)

  return Content
}
