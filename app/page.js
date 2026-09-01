export default async function Page({ searchParams }) {
  const sp = await searchParams
  return <pre id="out">{JSON.stringify(sp)}</pre>
}
