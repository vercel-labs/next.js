import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ClientContent } from './client-content'

// Dynamic metadata that depends on the route param, so every instance of this
// dynamic route has its own title.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return { title: id.charAt(0).toUpperCase() + id.slice(1) }
}

export default async function CoinPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main>
      <Link id="link-home" href="/">
        home
      </Link>
      <Suspense fallback={<p id="coin-fallback">loading…</p>}>
        <ClientContent id={id} />
      </Suspense>
    </main>
  )
}
