import { unauthorized } from 'next/navigation'

export default async function Page() {
  const session = false
  if (!session) unauthorized()
  return <p>dashboard</p>
}
