import WorkerDemo from './worker-demo';
export default function Page() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>Turbopack: emitted worker asset keeps an unrewritten sibling import</h1>
      <p>
        <code>new Worker(new URL(`./worker/${'{name}'}`, import.meta.url), {'{type:"module"}'})</code> — dynamic
        segment, exactly like maplibre-gl 6.x. Turbopack emits <code>app/worker/entry.mjs</code> verbatim into{' '}
        <code>/_next/static/media/</code> and does not rewrite its <code>./sibling.mjs</code> import, so the worker
        404s on its first import and never starts.
      </p>
      <WorkerDemo />
      <p>
        <a href="/maplibre">/maplibre</a> — same bug through maplibre-gl@6.6.0 (the original report).
      </p>
    </main>
  );
}
