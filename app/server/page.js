import { observer } from 'mobx-react'
import { counterStore } from '../store'

const ServerCounter = observer(function ServerCounter() {
  return <p>server count: {counterStore.count}</p>
})

export default function Page() {
  return <ServerCounter />
}
