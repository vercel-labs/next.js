import Link from 'next/link'
export default function Page3() {
  return (
    <div>
      <Link id="to-page4" href="/page4" style={{ position: 'fixed', top: 0, left: 0, background: '#ff0', zIndex: 10 }}>
        go to /page4
      </Link>
      <h1>Page 3 (app router)</h1>
      <div style={{ height: 8000 }}>tall content</div>
    </div>
  )
}
