export function generateStaticParams() {
  return Array.from({ length: 300 }, (_, i) => ({ id: String(i) }))
}
// A small pool of shared urls => the same fetch-cache entry files are written
// concurrently by every build worker process. revalidate:1 keeps entries going
// stale during the build so they are re-fetched and re-written many times.
const POOL = [0, 1, 2, 3]
export default async function Page({ params }) {
  const { id } = await params
  const out = []
  for (const q of POOL) {
    const res = await fetch(`http://127.0.0.1:4321/q?${q}`, { next: { revalidate: 1 } })
    const json = await res.json()
    out.push(json.result.length)
  }
  return <p>{id}:{out.join(',')}</p>
}
