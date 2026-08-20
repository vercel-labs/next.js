import Link from 'next/link'
import { headers } from 'next/headers'

export default async function Shop() {
  await headers()
  await new Promise((r) => setTimeout(r, 400))
  return (
    <main>
      <h1>Shop</h1>
      <ul>
        {Array.from({ length: 200 }, (_, i) => (
          <li key={i} style={{ height: 40 }}>
            <Link href={`/product/${i}`} id={`link-${i}`}>Product {i}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
