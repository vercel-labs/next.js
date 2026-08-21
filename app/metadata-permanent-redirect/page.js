import { permanentRedirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  await new Promise((r) => setTimeout(r, 1000))
  permanentRedirect('/target')
}

export default async function Page() {
  return <h1>metadata-permanent-redirect page body rendered</h1>
}
