export function generateStaticParams() {
  return [{ slug: 'привет' }, { slug: 'hae' }]
}
export default async function Slug({ params }) {
  const { slug } = await params
  return <h1 id="slug">dynamic slug: {slug}</h1>
}
