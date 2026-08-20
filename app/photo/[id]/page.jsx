export default async function PhotoPage({ params }) {
  const { id } = await params;
  const res = await fetch(`http://127.0.0.1:4000/photo/${id}?from=page`, {
    cache: 'no-store',
  });
  const data = await res.json();
  console.log('[page render] fetch hit number =', data.hit);
  return <div>full page photo {id} — counter hit {data.hit}</div>;
}
