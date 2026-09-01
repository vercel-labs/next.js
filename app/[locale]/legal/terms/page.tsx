import { Suspense } from 'react';
import { getCachedDoc } from '../../../../lib/cached';

async function Content({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const doc = await getCachedDoc('terms', locale);
  return <p>{doc.body}</p>;
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <main>
      <Suspense fallback={<p>loading…</p>}>
        <Content params={params} />
      </Suspense>
    </main>
  );
}
