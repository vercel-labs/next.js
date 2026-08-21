export const runtime = "edge"

export default async function Page({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params
  console.log('[edge page] resolvedParams=', JSON.stringify(resolvedParams), 'keys=', JSON.stringify(Object.keys(resolvedParams)))
  return (
    <div>
      <pre id="params">{JSON.stringify(resolvedParams)}</pre>
      <pre id="keys">{JSON.stringify(Object.keys(resolvedParams))}</pre>
      <pre id="slug">{JSON.stringify(resolvedParams.slug ?? null)}</pre>
    </div>
  )
}
