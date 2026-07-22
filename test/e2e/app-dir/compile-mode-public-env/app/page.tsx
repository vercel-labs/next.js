import ClientValue from './client'
import { getPublicEnv } from './env'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main>
      <p id="server-value">{getPublicEnv()}</p>
      <ClientValue />
    </main>
  )
}
