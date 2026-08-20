export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params
  console.log('[app] params.path =', JSON.stringify(path))
  return <div id="out">{JSON.stringify(path)}</div>
}
