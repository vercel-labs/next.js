import { getTenantComponents } from '../../lib/tenant-components'

export function generateStaticParams() {
  return [{ tenant: 'demo' }]
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>
}) {
  const { tenant } = await params
  const { Navbar, Provider } = getTenantComponents(tenant)

  return (
    <Provider>
      <Navbar />
      <main id="content">Dynamic tenant content</main>
    </Provider>
  )
}
