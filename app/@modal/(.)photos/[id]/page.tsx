export default async function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <dialog open id="modal">Photo {id} modal</dialog>
}
