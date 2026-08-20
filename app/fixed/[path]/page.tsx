import Nav from '../../nav'
export default async function Page({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params
  return (
    <>
      <div id="fixed-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#eee', padding: 12 }}>
        <Nav base="/fixed" />
      </div>
      <main style={{ paddingTop: 50 }}><h1 id="page-title">fixed {path}</h1>{Array.from({length:200},(_,i)=><p key={i}>{path} {i}</p>)}</main>
    </>
  )
}
