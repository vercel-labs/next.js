import { headers } from 'next/headers'

export default async function DashboardPage() {
  const h = await headers()
  return <p>ua: {h.get('user-agent')}</p>
}
