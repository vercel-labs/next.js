export const dynamic = 'force-dynamic'
import Link from 'next/link'
export default async function Item({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  console.log('[server] ITEM PAGE RENDERED', id)
  return (<main><h1>Item {id}</h1><Link href="/rq">back to /rq</Link></main>)
}
