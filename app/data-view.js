'use client';
import { useState } from 'react';
import Link from 'next/link';
import { loadMore } from './actions';

export default function DataView({ initialData }) {
  const [items, setItems] = useState(initialData);
  const [page, setPage] = useState(0);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h1>Home</h1>
      <p id="count">rendered items: {items.length}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <button
        id="load-more"
        onClick={async () => {
          const next = page + 1;
          const more = await loadMore(next);
          setPage(next);
          setItems((prev) => [...prev, ...more]);
        }}
      >
        Load more
      </button>
      <p>
        <Link id="go-to-10" href="/blog/10">
          Go to 10
        </Link>
      </p>
    </main>
  );
}
