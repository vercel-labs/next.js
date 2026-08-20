import Link from 'next/link'
export default async function Page({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params
  return (
    <>
      <div id="sticky-header" style={{ position: 'sticky', top: 0, background: '#eee', padding: 12 }}>
        <Link href="/missinghash/a#no-such-anchor" id="link-a">a#no-such-anchor</Link>{' '}
        <Link href="/missinghash/b#no-such-anchor" id="link-b">b#no-such-anchor</Link>
      </div>
      <main><h1 id="page-title">missinghash {path}</h1>{Array.from({length:200},(_,i)=><p key={i}>{path} {i}</p>)}</main>
    </>
  )
}
