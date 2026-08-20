export async function generateStaticParams() {
  return [];
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <h1>slug: {slug}</h1>;
}
