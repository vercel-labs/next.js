export default async function PhotoModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div id="photo-modal">PHOTO MODAL {id}</div>;
}
