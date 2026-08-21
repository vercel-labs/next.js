import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <button id="to-a" onClick={() => router.push('/a/detail')}>
      push to [a] page
    </button>
  )
}
