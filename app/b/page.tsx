import Link from 'next/link'
export default async function B({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = '1' } = await searchParams
  await new Promise(r => setTimeout(r, 3000))
  return <main><h1 id="content">B page {page}</h1><Link id="to-a" href="/a">to A</Link></main>
}
