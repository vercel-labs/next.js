import Link from 'next/link'
import { Box } from './box'

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <Link id="to-detail" href="/detail">
        Go to detail
      </Link>
      <Box size={80} />
    </main>
  )
}
