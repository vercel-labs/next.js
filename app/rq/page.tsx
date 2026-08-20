export const dynamic = 'force-dynamic'
import Link from 'next/link'
import RqClient from './rq-client'

export default function RqPage() {
  console.log('[server] RQ PAGE RENDERED', new Date().toISOString())
  return (
    <main>
      <h1>RQ</h1>
      <Link id="to-item" href="/item/1">go to /item/1</Link>
      <RqClient />
    </main>
  )
}
