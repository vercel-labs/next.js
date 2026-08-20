import Link from 'next/link'
export default function Foo() {
  console.log('[server] FOO PAGE RENDERED', new Date().toISOString())
  return (
    <main>
      <h1>Foo</h1>
      <Link href="/">home</Link>
    </main>
  )
}
