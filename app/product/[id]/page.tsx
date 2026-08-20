import Refresher from './refresher'

export default async function Product({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main style={{ height: 3000 }}>
      <h1 id="detail">Product {id}</h1>
      <Refresher />
    </main>
  )
}
