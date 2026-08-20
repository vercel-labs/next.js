export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ a: string }>
}) {
  const sp = await searchParams
  return (
    <div>
      <p>sp: {sp.a}</p>
    </div>
  )
}
