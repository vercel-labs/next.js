import type { MetadataRoute } from 'next'

export async function generateSitemaps() {
  return [{ id: 0 }]
}

export default async function sitemap(props: {
  id: number | Promise<number>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id

  return [
    {
      url: `https://example.com/pathname/${Number(id) + 1}`,
      alternates: {
        // `media` is documented for metadata alternates but is not part of the
        // Sitemap alternates type and is dropped from the generated XML.
        // @ts-expect-error -- media is not in the Sitemap alternates type
        media: {
          'only screen and (max-width: 640px)': `https://m.example.com/pathname/${Number(id) + 1}`,
        },
        languages: {
          es: `https://example.com/es/pathname/${Number(id) + 1}`,
        },
      },
    },
  ]
}
