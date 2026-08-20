export default async function Modal({ params }) {
  const { id } = await params;
  return (
    <div id="modal" style={{ position: 'fixed', inset: 0, background: 'black', color: 'white' }}>
      Modal (intercepted) for photo {id}
    </div>
  );
}
