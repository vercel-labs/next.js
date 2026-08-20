import Link from 'next/link'

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page = '1' } = await searchParams
  await new Promise((r) => setTimeout(r, 3000))
  return (
    <main>
      <h1 id="content">Page {page} (slow, 3s server delay)</h1>
      <Link id="to-2" href="/?page=2">go to page 2</Link>{' '}
      <Link id="to-3" href="/?page=3">go to page 3</Link>{' '}
      <Link id="to-nested" href="/other">go to /other (different route)</Link>
    </main>
  )
}
