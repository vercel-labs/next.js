export const dynamic = 'force-dynamic'
import Link from 'next/link'
export default async function Other() {
  await new Promise((r) => setTimeout(r, 3000))
  return <main><h1 id="content">Other page</h1><Link id="home" href="/">home</Link></main>
}
