import RegisteredServerComponent from './registered-server-component'
import { getComponent, register, type RegisteredComponent } from './registry'

register(
  new Map<string, RegisteredComponent>([
    ['registered', RegisteredServerComponent],
  ])
)

const Registered = getComponent('registered')

export default function Page() {
  return (
    <div>
      <Registered />
    </div>
  )
}
