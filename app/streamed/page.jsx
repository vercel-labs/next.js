import { Suspense } from 'react';
import Table from '../client-heavy/table';
import { bigRows, jsonLd } from '../big-data';

async function Slow() {
  await new Promise((r) => setTimeout(r, 30));
  return <Table rows={bigRows()} jsonLd={jsonLd} />;
}

export default function Page() {
  return (
    <Suspense fallback={<p>loading</p>}>
      <Slow />
    </Suspense>
  );
}
