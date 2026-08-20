import Nav from '../../nav'
export default async function Page({ params }: { params: any }) {
  const p = await params
  const path = (p.slug || ['root']).join('/')
  return (
    <>
      <div id="sticky-header" style={{ position: 'sticky', top: 0, background: '#eee', padding: 12 }}>
        <Nav base="/catchall" />
      </div>
      <main><h1 id="page-title">catchall {path}</h1>{Array.from({length:200},(_,i)=><p key={i}>{path} {i}</p>)}<div id="hash-target">hash target</div></main>
    </>
  )
}
