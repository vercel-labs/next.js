import Link from 'next/link'
export const dynamic = 'force-static'
export default async function Product({ params }) {
  const { id } = await params
  return (
    <main>
      <h1>Product {id}</h1>
      <p>Identical payload no matter which page linked here.</p>
      <Link href="/">Home</Link>
    </main>
  )
}
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
