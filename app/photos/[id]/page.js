export default async function PhotoPage({ params }) {
  const { id } = await params
  return <div id="full-page">FULL PAGE photo {id}</div>
}
