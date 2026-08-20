import { notFound } from 'next/navigation'

const AVAILABLE = ['2025']

export default async function Page({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const { year } = await searchParams
  console.log('[server] rendering /client with year =', year)
  if (!year || !AVAILABLE.includes(year)) {
    console.log('[server] notFound for year =', year)
    notFound()
  }
  return (
    <div>
      <h1 id="found">Found year {year}</h1>
    </div>
  )
}
