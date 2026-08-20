export const dynamicParams = true

export function generateStaticParams() {
  return [{ id: '1' }]
}

export default async function Page({ params }) {
  const { id } = await params
  return <p id="id">id: {id}</p>
}
