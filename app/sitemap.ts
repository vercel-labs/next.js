import type { MetadataRoute } from 'next'

export const runtime = 'edge'

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }]
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  return [
    { url: `https://example.com/${id}/a`, lastModified: new Date() },
  ]
}
