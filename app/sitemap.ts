import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  return [{ id: '0' }, { id: '1' }]
}

export default async function sitemap({
  id,
}: {
  id: string
}): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `https://example.com/section-${id}`,
      lastModified: new Date(),
    },
  ]
}
