export default async function Page(props: { params: Promise<{ pathParam: string }> }) {
  const params = await props.params
  return <pre id="out">{JSON.stringify({ params }, null, 2)}</pre>
}
