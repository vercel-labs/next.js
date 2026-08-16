import { Suspense } from 'react'
import { headers } from 'next/headers'

async function Cached({ slug }: { slug: string }) {
  'use cache'

  return <p id="cached">cached {slug}</p>
}

async function Dynamic() {
  const userAgent = (await headers()).get('user-agent') ?? ''

  return <p id="dynamic">user-agent length: {userAgent.length}</p>
}

// `generateStaticParams` gives the route a fallback shell prerender, which is
// the pass that runs with dynamic access tracking. This is what makes the
// "use cache" wrapper create a composite abort signal.
export async function generateStaticParams() {
  return [{ slug: 'seed' }]
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <main>
      <Suspense fallback={<p>loading...</p>}>
        <Dynamic />
      </Suspense>
      <Cached slug={slug} />
    </main>
  )
}
