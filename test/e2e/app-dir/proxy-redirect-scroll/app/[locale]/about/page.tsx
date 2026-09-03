export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <main>
      <h1 id="about">{`about: ${locale}`}</h1>
      {/* Tall enough that a preserved scroll offset keeps the h1 offscreen. */}
      <div style={{ height: 3000 }} />
    </main>
  )
}
