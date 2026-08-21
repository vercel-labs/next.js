import { $serverAction } from './actions'

export default function Page() {
  return <form action={$serverAction as never}><button>go</button></form>
}
