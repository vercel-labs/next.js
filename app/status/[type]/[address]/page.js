export default async function Page({ params }) {
  const p = await params
  console.log('PARAMS:', JSON.stringify(p))
  return <pre id="out">{JSON.stringify(p)}</pre>
}
