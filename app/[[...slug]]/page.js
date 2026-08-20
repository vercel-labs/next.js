export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return [{ slug: [] }, { slug: ['foo'] }, { slug: ['bar'] }]
}

export default async function Page({ params }) {
  const { slug } = await params
  return <p>slug: {JSON.stringify(slug ?? null)}</p>
}
