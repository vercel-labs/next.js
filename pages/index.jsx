import Link from 'next/link'
import MyLink from '../components/MyLink'

export default function Home() {
  // Docs (pre-fix) said `next/link-passhref` would flag this missing passHref.
  return (
    <Link href="/about" legacyBehavior>
      <MyLink>About</MyLink>
    </Link>
  )
}
