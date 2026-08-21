import type { MetadataRoute } from 'next'

// 4 sitemap shards, as in the docs "Generating multiple sitemaps" example.
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap({
  id,
}: {
  // NOTE: docs type this as `number`, but on next@16 canary it is a Promise.
  id: number | Promise<number>
}): Promise<MetadataRoute.Sitemap> {
  const index = Number(await id)
  return [
    { url: `http://localhost:3000/product/${index * 50_000 + 1}` },
    { url: `http://localhost:3000/product/${index * 50_000 + 2}` },
  ]
}
