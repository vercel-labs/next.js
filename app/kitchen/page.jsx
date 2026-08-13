import { after } from 'next/server';
import Image from 'next/image';
import { Suspense } from 'react';
import Form from './form';
import { submit } from './actions';
import { bigRows, jsonLd } from '../big-data';

export async function generateMetadata() {
  return { title: 'kitchen', other: { 'json-ld': jsonLd } };
}

async function Slow() {
  await new Promise((r) => setTimeout(r, 20));
  return <Form action={submit} rows={bigRows()} jsonLd={jsonLd} />;
}

export default function Page() {
  after(() => {});
  return (
    <main>
      <Image src="/next.svg" alt="x" width={100} height={100} />
      <Suspense fallback={<p>l</p>}>
        <Slow />
      </Suspense>
      <Form action={submit} rows={bigRows()} jsonLd={jsonLd} />
    </main>
  );
}
