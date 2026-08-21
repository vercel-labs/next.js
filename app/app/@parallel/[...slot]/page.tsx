export const dynamic = "force-dynamic";

export default async function Parallel() {
  await new Promise((r) => setTimeout(r, 5_000));
  return <h2>hello world</h2>;
}
