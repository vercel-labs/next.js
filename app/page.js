import Link from 'next/link'
import { revalidateUnrelatedTag } from './actions'

export default function Home() {
  return (
    <main>
      <h1>home</h1>
      <Link href="/b" id="link-b">
        go to /b
      </Link>
      <form action={revalidateUnrelatedTag}>
        <button type="submit" id="revalidate">
          revalidateTag(&apos;totally-unrelated-tag&apos;, &apos;max&apos;)
        </button>
      </form>
    </main>
  )
}
