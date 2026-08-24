import Link from 'next/link'
export default function Home() {
  const items = Array.from({ length: 20 }, (_, i) => `job-${i}`)
  return (
    <div>
      <Link href="/jobs">jobs</Link>
      <ul>{items.map((s) => (<li key={s}><Link href={`/jobs/${s}`}>{s}</Link></li>))}</ul>
    </div>
  )
}
