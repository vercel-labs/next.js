import { triggerRedirect } from './actions'

export default function Home() {
  return (
    <form action={triggerRedirect}>
      <button id="trigger" type="submit">Trigger A redirect</button>
    </form>
  )
}
