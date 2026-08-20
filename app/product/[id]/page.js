export const dynamic = 'force-dynamic'
export default async function Product({ params }) {
  const { id } = await params
  // simulate slow server render so a missing prefetch is obvious
  await new Promise((r) => setTimeout(r, 2000))
  return <h1 id="title">Product {id}</h1>
}
