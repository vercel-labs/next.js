import Pagination from '../Pagination'
import Link from 'next/link'

export default async function ListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams
  const page = Number(sp.page) || 1
  console.log('[server] @list rendered with page =', page)
  return (
    <div>
      <Pagination />
      <p id="server-page">server-rendered page: {page}</p>
      <Link id="open-detail" href={`/abc?page=${page}`}>open detail</Link>
    </div>
  )
}
