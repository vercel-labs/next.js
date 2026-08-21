import type { MetadataRoute } from 'next'

// Same behavior without generateSitemaps: `alternates.media` is dropped.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com/',
      alternates: {
        // @ts-expect-error -- media is not in the Sitemap alternates type
        media: {
          'only screen and (max-width: 640px)': 'https://m.example.com/',
        },
      },
    },
  ]
}
