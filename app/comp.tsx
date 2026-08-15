import { cacheLife } from 'next/cache';
import { doFetch, type Item } from './data';

// The component-level mirror of data.ts.
//
// data.ts nests by CALL: a cached function awaits a cached function, so the inner scope opens
// inside the outer one. This file nests by RENDER: a cached component returns a cached component as
// a JSX child. React renders that child itself, after the parent has already returned, so the inner
// scope should NOT open inside the outer one — the two should be siblings in time, not nested.
//
// Whether that distinction actually holds for memory retention is the thing being measured. Depth,
// fetch, payload and section count are identical to the function variant, so the only difference is
// call-nesting versus render-nesting.

const DEPTH = Number(process.env.CACHE_DEPTH ?? 5);

export async function CLevel1({ k }: { k: string }) {
  'use cache';
  cacheLife('hours');
  if (DEPTH < 2) return <Leaf items={await doFetch(k)} />;
  return <CLevel2 k={k} />;
}

async function CLevel2({ k }: { k: string }) {
  'use cache';
  cacheLife('hours');
  if (DEPTH < 3) return <Leaf items={await doFetch(k)} />;
  return <CLevel3 k={k} />;
}

async function CLevel3({ k }: { k: string }) {
  'use cache';
  cacheLife('hours');
  if (DEPTH < 4) return <Leaf items={await doFetch(k)} />;
  return <CLevel4 k={k} />;
}

async function CLevel4({ k }: { k: string }) {
  'use cache';
  cacheLife('hours');
  if (DEPTH < 5) return <Leaf items={await doFetch(k)} />;
  return <CLevel5 k={k} />;
}

async function CLevel5({ k }: { k: string }) {
  'use cache';
  cacheLife('hours');
  return <Leaf items={await doFetch(k)} />;
}

function Leaf({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <b>{item.name}</b>
          <span>{item.blurb}</span>
          <code>{item.values.join(',')}</code>
        </li>
      ))}
    </ul>
  );
}
