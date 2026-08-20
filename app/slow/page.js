export const dynamic = 'force-dynamic'
export default async function Slow() {
  await new Promise((r) => setTimeout(r, 2000))
  return <h1 id="slow">/slow rendered (server waited 2000ms)</h1>
}
