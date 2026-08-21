// There is no documented API to read the POST body here.
// `props` only ever contains `params` / `searchParams`.
export default async function PostPage(props: Record<string, unknown>) {
  return (
    <main>
      <h1>post-page rendered</h1>
      <pre id="props">{JSON.stringify(Object.keys(props))}</pre>
    </main>
  );
}
