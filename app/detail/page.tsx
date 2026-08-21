import Link from 'next/link'
import { Box } from '../box'

export default function Detail() {
  return (
    <main>
      <h1>Detail</h1>
      <Link id="to-home" href="/">
        Back to home (Link)
      </Link>
      <Box size={300} />
    </main>
  )
}
