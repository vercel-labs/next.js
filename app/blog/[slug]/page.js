import { draftMode } from 'next/headers'

// simulating a shared data-fetching helper that consults draft mode
async function getSlugs() {
  const { isEnabled } = await draftMode()
  return isEnabled ? ['draft-post'] : ['a', 'b']
}

export async function generateStaticParams() {
  const slugs = await getSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function Page({ params }) {
  const { slug } = await params
  return <p>post {slug}</p>
}
