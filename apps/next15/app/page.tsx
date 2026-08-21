import Link from 'next/link'

const slugs = Array.from({ length: 20 }, (_, i) => `product-${i + 1}`)

export default function Home() {
  return (
    <main>
      <h1>Products</h1>
      <ul>
        {slugs.map((slug) => (
          <li key={slug}>
            <Link href={`/products/${slug}`}>{slug}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
