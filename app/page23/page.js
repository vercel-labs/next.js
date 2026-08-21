async function getData() { await new Promise((r) => setTimeout(r, 50)); return 'data' }
export default async function Page23() {
  const d = await getData()
  return <h1>Page23 (await) {d}</h1>
}
