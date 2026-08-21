export const dynamic = 'force-dynamic'

export default async function Page() {
  await new Promise((r) => setTimeout(r, 1500))
  return <h1 id="content">yes-param content {Date.now()}</h1>
}
