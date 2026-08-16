import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1 id="home">Home</h1>
      <ul>
        <li>
          <Link id="link-bitcoin" href="/coin/bitcoin">
            bitcoin
          </Link>
        </li>
        <li>
          <Link id="link-ethereum" href="/coin/ethereum">
            ethereum
          </Link>
        </li>
      </ul>
    </main>
  )
}
