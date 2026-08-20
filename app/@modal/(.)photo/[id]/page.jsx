export default async function PhotoModal({ params }) {
  const { id } = await params;
  const res = await fetch(`http://127.0.0.1:4000/photo/${id}?from=modal`, {
    cache: 'no-store',
  });
  const data = await res.json();
  console.log('[modal render] fetch hit number =', data.hit);
  return <dialog open>modal photo {id} — counter hit {data.hit}</dialog>;
}
