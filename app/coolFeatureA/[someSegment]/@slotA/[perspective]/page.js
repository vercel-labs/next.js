export default async function Page({ params }) {
  const p = await params
  return <pre id="A-slotA-dynamic">A-slotA-dynamic params: {JSON.stringify(p)}</pre>
}
