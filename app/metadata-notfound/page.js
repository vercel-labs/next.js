import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  await new Promise((r) => setTimeout(r, 1000))
  notFound()
}

export default async function Page() {
  return <h1>metadata-notfound page body rendered</h1>
}
