import { headers } from 'next/headers';
// @ts-expect-error - untyped workspace package that also imports next/headers
import { getHost } from 'mylib';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  // `searchParams`/`params` are where `throwInvariantForMissingStore()` fires
  // (next/dist/server/request/search-params.js) when the render-time
  // workUnitAsyncStorage instance differs from the one that set the store.
  const sp = await searchParams;
  const host = (await headers()).get('host');
  const libHost = await getHost();

  return (
    <main>
      <p>searchParams: {JSON.stringify(sp)}</p>
      <p>headers().host: {String(host)}</p>
      <p>workspace-package headers().host: {String(libHost)}</p>
    </main>
  );
}
