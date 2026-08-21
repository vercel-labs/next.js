export const runtime = "edge"
export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const p = await params
  return <pre id="params">{JSON.stringify(p)}</pre>
}
