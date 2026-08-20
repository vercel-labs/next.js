import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return [{ slug: 'exists' }]
}

export default async function Slug({ params }) {
  const { slug } = await params
  if (slug !== 'exists') notFound()
  return <h1 id="slug">SLUG PAGE: {slug}</h1>
}
