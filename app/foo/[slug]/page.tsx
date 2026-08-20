export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Legitimately empty: e.g. no published CMS documents yet
  return []
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <h1>foo {slug}</h1>
}
