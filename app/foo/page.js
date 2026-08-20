import Link from 'next/link'
export default function Foo() {
  return (
    <div>
      <h1 id="top">Foo page</h1>
      <div style={{ height: 3000 }}>tall content</div>
      <Link id="trigger" href="/bar">Click here to trigger not found redirect</Link>
    </div>
  )
}
