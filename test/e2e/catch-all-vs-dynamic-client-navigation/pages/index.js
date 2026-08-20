import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <p id="page">home</p>
      <Link href="/hair/shop-by-hair-type/dry-scalp" id="to-catch-all-link">
        to catch-all via link
      </Link>
      <button
        id="to-catch-all-push"
        onClick={() => router.push('/hair/shop-by-hair-type/dry-scalp')}
      >
        to catch-all via push
      </button>
    </>
  )
}
