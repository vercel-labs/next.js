export const dynamic = 'force-dynamic'
async function getData() { await new Promise((r) => setTimeout(r, 100)); return Math.random() }
export default async function Page36() {
  const d = await getData()
  return <h1>Page36 (dynamic await) {d}</h1>
}
