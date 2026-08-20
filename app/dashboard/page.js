export default async function DashboardPage() {
  await new Promise((r) => setTimeout(r, 300))
  return <h1 id="dashboard">Dashboard</h1>
}
