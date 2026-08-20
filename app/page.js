export default async function Home({ searchParams }) {
  return <pre id="out">{JSON.stringify(await searchParams)}</pre>
}
