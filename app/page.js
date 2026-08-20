import Link from 'next/link'
export default function Home() {
  return (
    <main>
      <p><Link id="normal" href="/normal/test">Normal (dynamic) route</Link></p>
      {Array.from({ length: 9 }, (_, i) => (
        <p key={i}>
          <Link id={`bugged${i}`} href={`/bugged/s${i}`} prefetch={false}>
            Static route s{i} (no prefetch)
          </Link>
        </p>
      ))}
    </main>
  )
}
