export function generateStaticParams() {
  return [{ postSlug: 'post-1' }, { postSlug: 'post-2' }]
}
export default async function Post({ params }: { params: Promise<{ postSlug: string }> }) {
  const { postSlug } = await params
  return <h1>POST route: {postSlug}</h1>
}
