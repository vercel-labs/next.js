export default async function Target({ searchParams }) {
  const sp = await searchParams
  return (
    <main>
      <h1>Target</h1>
      <pre id="received">{JSON.stringify(sp)}</pre>
    </main>
  )
}
