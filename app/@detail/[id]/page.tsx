import Link from 'next/link'

export default async function DetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const sp = await searchParams
  return (
    <div>
      <p id="detail-page">detail {id} / page: {Number(sp.page) || 1}</p>
      <Link id="close" href="/">close</Link>
    </div>
  )
}
