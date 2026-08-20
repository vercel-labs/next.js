export const dynamic = 'force-dynamic';

export default function Page() {
  const dirname = import.meta.dirname;
  const filename = import.meta.filename;
  console.log('[app/page.tsx] import.meta.dirname =', dirname);
  console.log('[app/page.tsx] import.meta.filename =', filename);
  return (
    <main>
      <p id="dirname">dirname: {String(dirname)}</p>
      <p id="filename">filename: {String(filename)}</p>
      <p id="url">url: {String(import.meta.url)}</p>
    </main>
  );
}
