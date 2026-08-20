import { ClientComponent } from '../components/client'
import { ServerComponent } from '../components/server'

const data = 'a string'

export default function Page() {
  return (
    <ClientComponent data={data}>
      <ServerComponent data={data} />
    </ClientComponent>
  )
}
