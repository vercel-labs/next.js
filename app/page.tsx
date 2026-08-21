'use client';
import { useState } from 'react';
import { useFindBrandsQuery } from '../src/api';

export default function Page() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // deliberately a NEW object literal on every render (no useMemo)
  const queryArgs = { page, search };

  const { data, isFetching } = useFindBrandsQuery(queryArgs);

  return (
    <main style={{ fontFamily: 'monospace', padding: 24 }}>
      <button id="next-page" onClick={() => setPage((p) => p + 1)}>next page</button>
      <input id="search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div id="state">state page={page} search={JSON.stringify(search)}</div>
      <div id="fetching">isFetching={String(isFetching)}</div>
      <div id="data">data={JSON.stringify(data)}</div>
    </main>
  );
}
