import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export function generateMetadata() {
  redirect('/target')
}

export default async function Page() {
  return <h1>metadata-redirect-sync page body rendered</h1>
}
