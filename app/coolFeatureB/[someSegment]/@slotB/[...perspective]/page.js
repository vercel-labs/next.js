export default async function Page({ params }) {
  const p = await params
  return <pre id="B-slotB-catchall">B-slotB-catchall params: {JSON.stringify(p)}</pre>
}
