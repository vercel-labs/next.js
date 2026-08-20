export const revalidate = 30
export const dynamicParams = true

export function generateStaticParams() {
  return [{ slug: 'prebuilt' }]
}

export default async function Page({ params }) {
  const { slug } = await params
  await new Promise((r) => setTimeout(r, 5000))
  return <div id="content-bugged">Bugged page, slug: {slug}</div>
}
