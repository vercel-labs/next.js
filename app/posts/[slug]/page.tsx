export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return Array.from({ length: 200 }, (_, i) => ({ slug: `post-${i}` }));
}

// A body large enough that each render produces a non-trivial RSC payload,
// mirroring a real content page.
const PARAGRAPH = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(40);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <main>
      <h1>{slug}</h1>
      {Array.from({ length: 50 }, (_, i) => (
        <p key={i}>{PARAGRAPH}</p>
      ))}
    </main>
  );
}
