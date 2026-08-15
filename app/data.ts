import { cacheLife } from 'next/cache';

export interface Item {
  id: string;
  name: string;
  blurb: string;
  values: number[];
}

const UPSTREAM = process.env.UPSTREAM ?? 'http://127.0.0.1:3101';

// How many NESTED `use cache` scopes one read opens. 1 = a single cached function that fetches
// directly; 5 = a cached function calling a cached function, five deep. Breadth (SECTIONS) is held
// constant so this isolates depth.
const DEPTH = Number(process.env.CACHE_DEPTH ?? 5);

/** The actual work. Deliberately NOT cached, so it is identical at every depth. */
export async function doFetch(key: string): Promise<Item[]> {
  const res = await fetch(`${UPSTREAM}/?slug=${encodeURIComponent(key)}`, {
    signal: AbortSignal.timeout(3000),
  });
  const json = (await res.json()) as { items: Item[] };
  return json.items;
}

async function level5(key: string): Promise<Item[]> {
  'use cache';
  cacheLife('hours');
  return doFetch(key);
}

async function level4(key: string): Promise<Item[]> {
  'use cache';
  cacheLife('hours');
  return DEPTH >= 5 ? level5(key) : doFetch(key);
}

async function level3(key: string): Promise<Item[]> {
  'use cache';
  cacheLife('hours');
  return DEPTH >= 4 ? level4(key) : doFetch(key);
}

async function level2(key: string): Promise<Item[]> {
  'use cache';
  cacheLife('hours');
  return DEPTH >= 3 ? level3(key) : doFetch(key);
}

export async function getItems(key: string): Promise<Item[]> {
  'use cache';
  cacheLife('hours');
  return DEPTH >= 2 ? level2(key) : doFetch(key);
}
