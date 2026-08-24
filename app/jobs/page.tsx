import Link from 'next/link'
import { cacheLife } from 'next/cache'

async function Listing() {
  'use cache'
  cacheLife('minutes')
  const items = Array.from({ length: 200 }, (_, i) => `job-${i}`)
  return (
    <ul>
      {items.map((s) => (
        <li key={s}>
          <Link href={`/jobs/${s}`}>{s}</Link>
          <span>{'x'.repeat(200)}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Jobs() {
  return <main><Listing /></main>
}
