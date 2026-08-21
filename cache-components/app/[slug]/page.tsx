import { notFound } from "next/navigation"

const posts = ["grove", "mediated-matter", "out-here-archery"]

export function generateStaticParams() {
  return posts.map((slug) => ({ slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!posts.includes(slug)) notFound()
  return <h1>post: {slug}</h1>
}
