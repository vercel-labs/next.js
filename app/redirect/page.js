import { permanentRedirect } from 'next/navigation'
export default async function Page() {
  await new Promise((r) => setTimeout(r, 100))
  permanentRedirect('/target')
}
