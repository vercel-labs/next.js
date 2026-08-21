// Dynamic because of `{ cache: 'no-store' }`
export default async function Page() {
  const res = await fetch('https://jsonplaceholder.typicode.com/comments?_page=1&_limit=2', {
    cache: 'no-store',
  })
  const comments = await res.json()
  return <pre>{JSON.stringify(comments.map((c) => c.id))}</pre>
}
