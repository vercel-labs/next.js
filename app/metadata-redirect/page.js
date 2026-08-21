import { redirect } from 'next/navigation'

export async function generateMetadata() {
  await new Promise((r) => setTimeout(r, 1000))
  redirect('/target')
}

export default async function Page() {
  await new Promise((r) => setTimeout(r, 2000))
  return <h1>metadata-redirect page body rendered</h1>
}
