export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  return <p id="slug">slug: {JSON.stringify(slug ?? null)}</p>
}
