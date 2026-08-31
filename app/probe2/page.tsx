import ClientBits from './ClientBits';

export const dynamic = 'force-dynamic';

export default async function Page() {
  await new Promise((r) => setTimeout(r, 300));
  return <main>{[1, 2, 3, 4, 5].map((n) => <ClientBits key={n} n={n} />)}</main>;
}
