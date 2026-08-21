export default async function Page({ params }) {
  const { slug } = await params;
  return <p>slug: {slug}</p>;
}
