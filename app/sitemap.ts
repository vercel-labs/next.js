import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  return [{ id: 1 }]
}

export default async function sitemap({
  id,
}: {
  id: number
}): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: 'https://example.com/video/1',
      lastModified: new Date('2024-01-01'),
      videos: [
        {
          title: 'MD0186 肉【钟宛冰&苏语棠】',
          thumbnail_loc: 'https://example.com/thumb.jpg',
          description: 'a & b < c > d "quoted"',
        },
      ],
      images: ['https://example.com/img.jpg?a=1&b=2'],
    },
  ]
}
