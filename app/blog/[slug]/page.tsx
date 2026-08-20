export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await new Promise((r) => setTimeout(r, 3000));
  return <div id="slug-page">post: {slug}</div>;
}
