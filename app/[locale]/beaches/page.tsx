export default async function Beaches({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <h1>BEACHES-{locale}</h1>
}
