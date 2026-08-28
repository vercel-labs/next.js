import { notFound } from 'next/navigation'
import { cacheLife } from 'next/cache'

const POSTS = ['hello', 'world']

export async function generateStaticParams() {
  return POSTS.map((slug) => ({ slug }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  'use cache'
  cacheLife('max')

  const { slug } = await params

  if (!POSTS.includes(slug)) {
    notFound()
  }

  return <h1 id="slug">{slug}</h1>
}
