export default async function InterceptedPhoto({ params }) {
  const { id } = await params
  return <div id="modal-content">Modal for photo {id}</div>
}
