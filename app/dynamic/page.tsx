export const dynamic = 'force-dynamic'

async function getData() {
  await new Promise((r) => setTimeout(r, 1500))
  return { now: new Date().toISOString() }
}

export default async function DynamicPage() {
  const data = await getData()
  return <h1 id="content">DYNAMIC CONTENT {data.now}</h1>
}
