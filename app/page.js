export default async function Page() {
  const res = await fetch('http://127.0.0.1:4000/', { next: { revalidate: 5 } })
  const data = await res.json()
  return <pre>{JSON.stringify(data)}</pre>
}
