import type { MetadataRoute } from 'next'

const base = process.env.SITE_URL ?? 'https://example.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, lastModified: new Date('2025-01-01'), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date('2025-01-01'), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
