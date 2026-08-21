export const dynamic = 'force-dynamic'
export default async function Slow() {
  await new Promise((r) => setTimeout(r, 3000))
  return <h1 id="page-slowloading">Slow page WITH loading.js, rendered at {Date.now()}</h1>
}
