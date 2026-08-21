export function generateStaticParams() {
  return [{ slug: 'one' }, { slug: 'two' }]
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <p>a/{slug}</p>
}
