import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
      <a id="anchor-ok" href="/ok">
        [works] plain anchor to /ok (full page load, one 307 to /ok/child)
      </a>
      <Link id="link-ok" href="/ok" prefetch={false}>
        [BUG] next/link to /ok — layout redirect()s to /ok/child, router then refetches
        /ok/child forever (~35 RSC requests/second)
      </Link>
      <Link id="link-a" href="/a" prefetch={false}>
        [works] next/link to /a — layout redirect()s to /b, which is NOT under /a/layout.tsx
      </Link>
    </div>
  )
}
