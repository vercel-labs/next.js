import { Suspense } from 'react';

async function Content() {
  await new Promise((r) => setTimeout(r, 2000));
  const data = await fetch('https://api.vercel.app/blog', { cache: 'no-store' });
  const posts = await data.json();
  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold">Next Starter ⚡ ({posts.length})</h1>
      <p className="text-lg">A highly opinionated and complete starter</p>
    </section>
  );
}

export default function Page() {
  return (
    <div>
      <Suspense fallback={<p>Loading…</p>}>
        <Content />
      </Suspense>
    </div>
  );
}
