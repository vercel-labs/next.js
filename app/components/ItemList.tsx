'use client';

import {useMemo, useState} from 'react';

const ITEMS = Array.from({length: 200}, (_, i) => ({
  id: i,
  name: `item-${i}`,
  price: (i * 37) % 1000,
}));

export function ItemList() {
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(
    () => [...ITEMS].sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price)),
    [sortAsc],
  );

  return (
    <section>
      <h2>Items</h2>
      <button onClick={() => setSortAsc((v) => !v)}>sort: {sortAsc ? 'asc' : 'desc'}</button>
      <ul>
        {sorted.slice(0, 50).map((item) => (
          <li key={item.id}>
            {item.name} — {item.price}
          </li>
        ))}
      </ul>
    </section>
  );
}
