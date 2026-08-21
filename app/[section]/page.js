import Link from 'next/link'
export default async function P({ params }) {
  const p = await params
  return <div>section = {JSON.stringify(p.section)}<br/><Link id="to-list" href="/list/1">/list/1</Link> <Link id="to-item" href="/photos/9">/photos/9</Link></div>
}
