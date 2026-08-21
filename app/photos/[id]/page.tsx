export default async function Photo({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return <div>photo {(await params).id}</div>
}
