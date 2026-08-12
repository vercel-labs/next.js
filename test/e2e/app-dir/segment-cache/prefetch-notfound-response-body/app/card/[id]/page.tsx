import { notFound } from 'next/navigation'

// On-demand ISR: no ids are known at build time, so the first request renders
// the page and the result — including the 404 — is cached.
export const revalidate = 3600

export function generateStaticParams(): Array<{ id: string }> {
  return []
}

const KNOWN_IDS = new Set(['alpha'])

async function fetchCard(id: string): Promise<{ name: string } | null> {
  // Stands in for a catalog lookup; the async hop is deliberate.
  await new Promise((resolve) => setTimeout(resolve, 5))
  return KNOWN_IDS.has(id) ? { name: `Card ${id}` } : null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await fetchCard(id)
  return { title: card?.name ?? id }
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const card = await fetchCard(id)
  if (!card) {
    notFound()
  }
  return <h1 id="card">{card.name}</h1>
}
