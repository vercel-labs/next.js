import { ClientComponent } from './components/client'
import { ServerComponent } from './components/server'

const data = { some: 'object' }

export default function Page() {
  return (
    <ClientComponent data={data}>
      <ServerComponent data={data} />
    </ClientComponent>
  )
}
