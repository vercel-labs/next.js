import { Suspense } from 'react'
import { connection } from 'next/server'

export async function generateStaticParams() {
  return [{ slug: 'how-tailwind-grew-on-me' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // dynamic metadata: forces the metadata slot into the postponed (dynamic) hole
  await connection()
  return { title: `Post: ${slug}`, description: `desc ${slug}` }
}

async function Dynamic() {
  await connection()
  return <p id="dynamic">dynamic at {Date.now()}</p>
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <main>
      <h1>{slug}</h1>
      <Suspense fallback={<p id="fallback">loading…</p>}>
        <Dynamic />
      </Suspense>
    </main>
  )
}
