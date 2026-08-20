export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return <h1 id="about">About ({lang})</h1>
}
