export const dynamicParams = false

export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

export default async function Page({ params }) {
  const { id } = await params
  return <p>id: {id}</p>
}
