export const dynamic = 'force-dynamic'

export default async function Slow() {
  await new Promise((r) => setTimeout(r, 5000))
  return <h1 id="page">SLOW PAGE LOADED</h1>
}
