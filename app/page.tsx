import Link from 'next/link'
import { LinkWithStatus } from './link-with-status'

export default function Home() {
  return (
    <ul style={{ lineHeight: 2, fontSize: 18 }}>
      <li>
        <Link id="no-prefetch" href="/no-prefetch" prefetch={false}>
          /no-prefetch (prefetch=false, has loading.tsx, page awaits 3s)
        </Link>
      </li>
      <li>
        <Link id="prefetch" href="/prefetch">
          /prefetch (default prefetch, has loading.tsx, page awaits 3s)
        </Link>
      </li>
      <li>
        <LinkWithStatus id="link-status" href="/link-status" />
      </li>
    </ul>
  )
}
