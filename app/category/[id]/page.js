import Link from 'next/link'
export const dynamic = 'force-static'
export default async function Category({ params }) {
  const { id } = await params
  return (
    <main>
      <h1>Category {id}</h1>
      <Link href="/product/1">Product 1</Link>
      <Link href="/product/2">Product 2</Link>
    </main>
  )
}
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
