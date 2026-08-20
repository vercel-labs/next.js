export default async function Page({ params }) {
  const p = await params
  return <pre id="A-slotB-dynamic">A-slotB-dynamic params: {JSON.stringify(p)}</pre>
}
