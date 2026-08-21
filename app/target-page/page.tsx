export default async function TargetPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  return (
    <main>
      <h2>searchParams received by the page</h2>
      <pre id="params">{JSON.stringify(params, null, 2)}</pre>
    </main>
  )
}
