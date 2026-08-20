import {headers} from 'next/headers';

export function generateStaticParams() {
  return [{locale: 'en'}];
}

export const dynamicParams = false;

export default async function Page({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  // Removing this `headers()` call makes `dynamicParams = false` work again
  // (prod then returns 404 for /de).
  const list = await headers();

  return (
    <main>
      <div>Hello {locale}!</div>
      <div>{JSON.stringify(Object.fromEntries(list))}</div>
    </main>
  );
}
