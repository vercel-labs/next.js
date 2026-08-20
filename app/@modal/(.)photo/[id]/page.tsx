export default async function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div id="modal" style={{ border: '2px solid red', padding: 8 }}>
      MODAL for photo {id}
    </div>
  )
}
