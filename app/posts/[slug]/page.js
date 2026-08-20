export async function generateStaticParams() {
  // Empty list of params (e.g. CMS returned no posts today)
  return []
}

export default async function Post({ params }) {
  const { slug } = await params
  return <h1>post {slug}</h1>
}
