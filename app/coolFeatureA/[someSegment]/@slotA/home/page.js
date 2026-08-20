export default async function Page({ params }) {
  const p = await params
  return <pre id="A-slotA-home">A-slotA-home params: {JSON.stringify(p)}</pre>
}
