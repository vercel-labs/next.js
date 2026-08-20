import Link from 'next/link'
export default function Home() {
  return (
    <div>
      <Link id="to-page2" href="/page2" style={{ position: 'fixed', top: 0, left: 0, background: '#ff0', zIndex: 10 }}>
        go to /page2
      </Link>
      <h1>Page 1 (pages router)</h1>
      <div style={{ height: 8000 }}>tall content</div>
    </div>
  )
}
