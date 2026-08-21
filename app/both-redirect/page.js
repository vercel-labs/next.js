import { redirect } from 'next/navigation'

export async function generateMetadata() {
  await new Promise((r) => setTimeout(r, 1000))
  redirect('/generate-metadata-redirect')
}

export default async function Page() {
  await new Promise((r) => setTimeout(r, 2000))
  redirect('/server-component-redirect')
}
