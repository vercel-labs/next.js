export const dynamic = 'force-dynamic'
export default async function Page() {
  await new Promise((r) => setTimeout(r, 2000))
  return <p id="grandchild-page">Grandchild page</p>
}
