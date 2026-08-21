export async function generateMetadata() {
  return {
    title: 'Control page',
    openGraph: {
      title: 'Control page',
      description: 'No hoisted styles, og tags near top',
      images: ['https://example.com/og.png'],
    },
  };
}

export default function Page() {
  return (
    <main>
      <h1>control</h1>
    </main>
  );
}
