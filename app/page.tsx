import { ComponentLayout } from '../components/ComponentLayout'
import { ServerCard } from '../components/ServerCard'
import { ClientCard } from '../components/ClientCard'
import { DynamicHost } from '../components/DynamicHost'

export default function Page() {
  return (
    <>
      <ComponentLayout>Plain ComponentLayout in page: RED</ComponentLayout>
      <ServerCard />
      <ClientCard />
      <DynamicHost />
    </>
  )
}
