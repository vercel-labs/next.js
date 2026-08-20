export default async function Photo({ params }) {
  const { id } = await params
  return <div id="page-content">Full page for photo {id}</div>
}
