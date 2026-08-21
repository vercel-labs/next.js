import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'abcdefgh',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function getSlugs(): Promise<string[]> {
  try {
    const posts = await client.fetch<{ slug: string }[]>(
      `*[_type == "post"]{ "slug": slug.current }`
    )
    return posts.map((p) => p.slug)
  } catch {
    return []
  }
}
