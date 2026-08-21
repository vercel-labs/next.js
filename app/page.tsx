import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <h1>Acme Dashboard</h1>
      <p>Static page, no client components.</p>
      <ul>
        {Array.from({ length: 50 }, (_, i) => (
          <li key={i}>
            <Link href={`/item/${i}`}>Item {i}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
