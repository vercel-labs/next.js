export const fetchCache = 'only-cache'
export default async function Page() {
  const res = await fetch('https://example.com', { next: { revalidate: 0 } })
  return <p>{(await res.text()).length}</p>
}
