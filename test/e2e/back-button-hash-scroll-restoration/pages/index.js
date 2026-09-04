import Link from 'next/link'

export default function Index() {
  return (
    <ul>
      <li>
        <Link id="to-pages-test" href="/test">
          pages test page without hash
        </Link>
      </li>
      <li>
        <Link id="to-pages-test-hash" href="/test#anchor">
          pages test page with hash
        </Link>
      </li>
      <li>
        <Link id="to-app-test" href="/app-test">
          app test page without hash
        </Link>
      </li>
      <li>
        <Link id="to-app-test-hash" href="/app-test#anchor">
          app test page with hash
        </Link>
      </li>
    </ul>
  )
}
