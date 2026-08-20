import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <p key={n}>
          <Link id={`link-${n}`} href={`/slug-${n}`} prefetch={false}>
            SuspenseTest {n}
          </Link>
        </p>
      ))}
    </main>
  )
}
