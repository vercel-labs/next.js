'use cache'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default async function Page({ params }) {
  const { locale } = await params
  const start = Date.now()
  await sleep(1000)
  return (
    <main>
      <h1>default &quot;use cache&quot; — locale: {locale}</h1>
      <p id="rendered-at">rendered-at: {new Date(start).toISOString()}</p>
      <p id="random">render-id: {Math.random().toString(36).slice(2)}</p>
      <p>took: {Date.now() - start}ms</p>
    </main>
  )
}
