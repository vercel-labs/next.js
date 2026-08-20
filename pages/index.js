import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Index page</h1>
      <button id="go" onClick={() => router.push('/about')}>
        Go to /about (client-side navigation)
      </button>
    </main>
  )
}
