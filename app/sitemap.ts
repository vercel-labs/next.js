import type { MetadataRoute } from 'next'
import { getSlugs } from '../sanity'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSlugs()
  return [
    { url: 'https://example.com', lastModified: new Date() },
    ...slugs.map((s) => ({ url: `https://example.com/${s}` })),
  ]
}
