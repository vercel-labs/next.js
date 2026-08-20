export const dynamic = 'force-dynamic'
export default async function Page({ params }) {
  const { slug } = await params
  await new Promise((r) => setTimeout(r, 5000))
  return <div id="content-normal">Normal Page, slug: {slug}</div>
}
