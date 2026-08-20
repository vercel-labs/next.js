export default async function Modal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await new Promise((r) => setTimeout(r, 300));
  return (
    <div data-testid="modal" style={{ border: '2px solid red', padding: 8 }}>
      MODAL for resource {id}
    </div>
  );
}
