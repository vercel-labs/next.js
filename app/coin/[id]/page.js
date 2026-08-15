import { Suspense } from 'react';
import Link from 'next/link';
import ClientContainer from './client-container';
import Loading from './loading';

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: id.charAt(0).toUpperCase() + id.slice(1) };
}

export default async function CoinAnalysis({ params }) {
  const { id } = await params;
  return (
    <>
      <Link id="home" href="/">home</Link>
      <Suspense fallback={<Loading />}>
        <ClientContainer coinId={id} />
      </Suspense>
    </>
  );
}
