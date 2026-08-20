import Link from 'next/link'
export default async function Home({ searchParams }) {
  const sp = await searchParams
  const qs = new URLSearchParams(sp).toString()
  return (
    <main>
      <h1 id="home">Home feed (query: {qs || 'none'})</h1>
      <div><Link id="setq" href="/?example=21">Set query via soft nav</Link></div>
      {[1, 2, 3].map((id) => (
        <div key={id}>
          <Link id={`photo-${id}`} href={`/photos/${id}`}>Photo {id} (plain)</Link>{' '}
          <Link id={`photoq-${id}`} href={`/photos/${id}?${qs}`}>Photo {id} (with query)</Link>
        </div>
      ))}
    </main>
  )
}
