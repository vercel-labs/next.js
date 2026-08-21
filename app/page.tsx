import { getTenantConfig } from '../lib/config'

export default async function Page() {
  const config = await getTenantConfig()
  return <p>tenant: {config.tenant}</p>
}
