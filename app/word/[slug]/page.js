const COUNT = Number(process.env.PAGE_COUNT || 100000);

export function generateStaticParams() {
  return Array.from({ length: COUNT }, (_, i) => ({ slug: `word-${i}` }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
