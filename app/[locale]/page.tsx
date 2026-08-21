export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <h1>HOME-{locale}</h1>
}
