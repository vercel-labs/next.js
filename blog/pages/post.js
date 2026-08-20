import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  return (
    <main>
      <h1 id="blog-post">Blog zone post page</h1>
      <p>
        <Link href="../" id="link-up">Up one level (../) — expected: home zone /</Link>
      </p>
      <p>
        <button id="push-up" onClick={() => router.push('../')}>
          router.push(&apos;../&apos;)
        </button>
      </p>
      <p>
        <a href="/" id="native-up">native anchor to /</a>
      </p>
    </main>
  )
}
