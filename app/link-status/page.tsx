export const dynamic = 'force-dynamic'

export default async function Page() {
  await new Promise((r) => setTimeout(r, 3000))
  return <p id="content">CONTENT for /link-status rendered after 3s server delay</p>
}
