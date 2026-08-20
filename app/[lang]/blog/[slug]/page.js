export function generateStaticParams() {
  return [
    { lang: 'en', slug: 'test-1' },
    { lang: 'en', slug: 'test-2' },
  ]
}

export default async function Page({ params }) {
  const { lang, slug } = await params
  return <h1>{lang} / {slug}</h1>
}
