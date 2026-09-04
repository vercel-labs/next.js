import Link from 'next/link'
export const dynamic = 'force-dynamic'
export default function Page() {
  return (
    <>
      <h1>Strict (no style-src-attr)</h1>
      <Link href="/strict/second">Strict second</Link>
    </>
  )
}
