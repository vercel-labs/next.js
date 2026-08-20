import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  return (
    <div>
      <h1>home</h1>
      <Link id="masked-link" href="/test/1?foo=bar" as="/test/1">
        link
      </Link>
      <button id="push-btn" onClick={() => router.push('/test/1?foo=bar', '/test/1')}>
        push
      </button>
      <Link id="masked-link2" href="/original" as="/masked">
        link2
      </Link>
    </div>
  )
}
