export default async function Page({ params }) {
  const p = await params
  return <pre id="B-slotA-home">B-slotA-home params: {JSON.stringify(p)}</pre>
}
