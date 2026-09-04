import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  return (
    <>
      <Link href="../" id="relative-parent-link">
        to parent
      </Link>
      <button
        id="relative-parent-push"
        onClick={() => {
          router.push('../')
        }}
      >
        push to parent
      </button>
    </>
  )
}
