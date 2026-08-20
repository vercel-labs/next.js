import { notFound } from "next/navigation"

export default async function BlogPost({ params }) {
  const { slug } = await params
  if (slug === 'foo') {
    notFound()
  }

  return (
    <div>
      Blog Post: {slug}
    </div>
  )
}
