import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (slug === 'trigger-not-found') {
    notFound()
  }
  return <h1 id="slug-page">Slug: {slug}</h1>
}
