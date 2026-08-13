// A typical prerendered detail page: concrete params from
// generateStaticParams, with content derived entirely from the param. Every
// listed slug is prerendered at build time.
export function generateStaticParams() {
  return [{ slug: 'alpha' }, { slug: 'bravo' }]
}

export default async function Page({ params }: PageProps<'/items/[slug]'>) {
  const { slug } = await params
  return <h1 id="item">{`Item: ${slug}`}</h1>
}
