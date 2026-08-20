import Nav from '../../nav'
export default async function Page({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params
  return (
    <>
      <title>{`title ${path}`}</title>
      <Nav base="/title" />
      <main><h1 id="page-title">title {path}</h1>{Array.from({length:200},(_,i)=><p key={i}>{path} {i}</p>)}</main>
    </>
  )
}
