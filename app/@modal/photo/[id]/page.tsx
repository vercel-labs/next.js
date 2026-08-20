export default async function Modal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <p id="modal">modal for photo {id}</p>;
}
