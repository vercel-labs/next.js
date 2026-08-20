import ClientParams from './client'

export default async function Target({ searchParams }) {
  const sp = await searchParams
  return (
    <div>
      <h1>Target</h1>
      <pre id="params">{JSON.stringify(sp)}</pre>
      <ClientParams />
    </div>
  )
}
