import Link from 'next/link'
export default async function A({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = '1' } = await searchParams
  await new Promise(r => setTimeout(r, 3000))
  return <main><h1 id="content">A page {page}</h1>
    <Link id="to-2" href="/a?page=2">A?page=2</Link>{' '}
    <Link id="to-nested" href="/b">to B</Link></main>
}
