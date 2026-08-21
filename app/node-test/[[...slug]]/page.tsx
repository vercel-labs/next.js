export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params
  return (
    <div>
      <pre id="params">{JSON.stringify(resolvedParams)}</pre>
      <pre id="slug">{JSON.stringify(resolvedParams.slug ?? null)}</pre>
    </div>
  )
}
