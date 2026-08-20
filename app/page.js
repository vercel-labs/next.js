import Image from 'next/image'

// Dynamic rendering so the per-request CSP nonce from middleware matches the
// script tags; the only remaining violation then comes from next/image.
export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main>
      <h1>next/image inline style vs strict CSP (issue #61388)</h1>
      <Image src="/next.svg" alt="Next.js Logo" width={180} height={38} />
    </main>
  )
}
