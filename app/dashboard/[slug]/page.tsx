export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  console.log(`[server] rendering /dashboard/${slug}`)
  return <h1>Dashboard: {slug}</h1>
}
