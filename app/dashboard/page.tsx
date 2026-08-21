export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return <h1>Dashboard token length: {String(sp.auth_token?.length)}</h1>;
}
