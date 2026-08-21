export default async function ListPage({ params }) {
  const p = await params
  return <div id="list-param">list id param = {JSON.stringify(p.id)}</div>
}
