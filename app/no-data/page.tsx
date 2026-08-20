import { ClientComponent } from '../components/client'
import { ServerComponent } from '../components/server'

const data = { some: 'object' }

export default function Page() {
  return (
    <ClientComponent data={undefined}>
      <ServerComponent data={data} />
    </ClientComponent>
  )
}
