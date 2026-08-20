import { fetchTime } from "../../lib";

export const revalidate = 3600;

export async function generateStaticParams() {
  return [1, 2, 3].map((n) => ({ id: n.toString() }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await fetchTime();
  console.log({ [`PAGE /u/${id} FETCH`]: data });
  return (
    <main>
      <h2>PAGE /u/{id} FETCH</h2>
      <pre id="fetched">{JSON.stringify(data, null, 2)}</pre>
      <p id="rendered-at">rendered at {new Date().toISOString()}</p>
    </main>
  );
}
