export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div id="photo-page">PHOTO PAGE {id}</div>;
}
