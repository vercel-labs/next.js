export function generateStaticParams({ params }: { params: { lang: string } }) {
  return params.lang === 'en' ? [{ slug: 'a' }, { slug: 'b' }] : []
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  return `${lang} ${slug}`
}
