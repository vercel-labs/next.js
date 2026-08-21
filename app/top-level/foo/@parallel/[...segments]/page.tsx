export default async function Page({ params }: { params: Promise<{ segments: string[] }> }) {
  const p = await params
  return <div id="parallel-catchall">parallel catch-all params: {JSON.stringify(p)}</div>
}
