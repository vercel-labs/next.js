export default async function Page({ params }) {
  const p = await params
  return <pre id="B-slotA-catchall">B-slotA-catchall params: {JSON.stringify(p)}</pre>
}
