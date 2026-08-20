import Nav from '../nav'
export default async function Page({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params
  return (
    <>
      <div id="sticky-header" style={{ position: 'sticky', top: 0, background: '#eee', padding: 12 }}>
        <Nav base="" />
      </div>
      <main><h1 id="page-title">root {path}</h1>{Array.from({length:200},(_,i)=><p key={i}>{path} {i}</p>)}</main>
    </>
  )
}
