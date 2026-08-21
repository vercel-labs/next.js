import { noop } from './actions'

export default function Home() {
  return (
    <form action={noop}>
      <input name="x" defaultValue="1" />
      <button type="submit">go</button>
    </form>
  )
}
