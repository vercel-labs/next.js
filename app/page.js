import Client from './client'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main>
      <p id="server-public">server NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</p>
      <p id="server-private">server PRIVATE_API_URL: {process.env.PRIVATE_API_URL}</p>
      <Client />
    </main>
  )
}
