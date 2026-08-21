export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <p>d/{slug}</p>
}
