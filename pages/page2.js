import Link from 'next/link'
export default function Page2() {
  return (
    <div>
      <Link id="to-home" href="/" style={{ position: 'fixed', top: 0, left: 0, background: '#ff0', zIndex: 10 }}>
        go to /
      </Link>
      <h1>Page 2 (pages router)</h1>
      <div style={{ height: 8000 }}>tall content</div>
    </div>
  )
}
