import { headers } from "next/headers";

export default async function Page(props: {
  params: Promise<{ slug?: string[]; domain: string }>;
}) {
  const params = await props.params;
  const hdrs = await headers();

  return (
    <main>
      <h1 id="ok">rendered</h1>
      <pre>{JSON.stringify({ params, host: hdrs.get("host") }, null, 2)}</pre>
    </main>
  );
}
