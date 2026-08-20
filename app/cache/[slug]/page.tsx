export const revalidate = 3000
export const generateStaticParams = () => []

const base = `http://127.0.0.1:${process.env.PORT || 3000}`

async function get(slug: string, revalidate: number, tags: string[]) {
  const res = await fetch(`${base}/api/date/${slug}`, { next: { revalidate, tags } })
  return (await res.json()).date as string
}

export default async function Page() {
  // fetch A: long revalidate (60s), tag "A"
  const a = await get('a', 60, ['A'])
  // fetch B: short revalidate (20s), tag "B"
  const b = await get('b', 20, ['B'])
  return (
    <div>
      <div>A(rev60): {a}</div>
      <div>B(rev20): {b}</div>
      <div>rendered: {new Date().toISOString()}</div>
    </div>
  )
}
