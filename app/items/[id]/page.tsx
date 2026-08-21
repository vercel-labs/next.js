import { notFound } from 'next/navigation'
import { getItem } from '../../data'
import DeleteButtons from './delete-buttons'

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = getItem(id)
  console.log(`[render] /items/${id} -> ${item ? 'found' : 'NOT FOUND (404)'}`)
  if (!item) notFound()
  return (
    <main>
      <h1>{item.name}</h1>
      <DeleteButtons id={id} />
    </main>
  )
}
