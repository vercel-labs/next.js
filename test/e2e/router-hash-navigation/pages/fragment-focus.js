import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <Link href="#focus-target" id="link-to-fragment">
        skip to main with next/link
      </Link>
      <a href="#focus-target" id="anchor-to-fragment">
        skip to main with native anchor
      </a>
      <main id="focus-target" tabIndex={-1}>
        <div style={{ height: '200vh' }}>main content</div>
      </main>
    </div>
  )
}
