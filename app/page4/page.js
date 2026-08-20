import Link from 'next/link'
export default function Page4() {
  return (
    <div>
      <Link id="to-page3" href="/page3" style={{ position: 'fixed', top: 0, left: 0, background: '#ff0', zIndex: 10 }}>
        go to /page3
      </Link>
      <h1>Page 4 (app router)</h1>
      <div style={{ height: 8000 }}>tall content</div>
    </div>
  )
}
