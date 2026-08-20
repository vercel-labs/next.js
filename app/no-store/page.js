export const fetchCache = 'only-cache'
export default async function Page() {
  const res = await fetch('https://example.com', { cache: 'no-store' })
  return <p>{(await res.text()).length}</p>
}
