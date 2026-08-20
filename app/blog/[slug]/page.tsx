export async function generateStaticParams() {
  return [{ slug: 'a' }]
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await new Promise((r) => setTimeout(r, 4000))
  return <h1 id="page">blog page {slug}</h1>
}
