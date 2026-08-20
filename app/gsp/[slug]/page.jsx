export const dynamicParams = true

export function generateStaticParams() {
  return [{ slug: 'prebuilt' }]
}

export default async function Page({ params }) {
  const { slug } = await params
  if (slug !== 'prebuilt') {
    throw new Error('boom from server component (gsp)')
  }
  return <h1>ok: {slug}</h1>
}
