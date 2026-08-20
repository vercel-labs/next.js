import Normal from './Normal'
import Memo from './Memo'
import IndirectMemo from './IndirectMemo'
import RefreshButton from './RefreshButton'

export default function Page() {
  return (
    <main>
      <p>server render: {Date.now()}</p>
      <RefreshButton />
      <Normal />
      <Memo />
      <IndirectMemo />
      <pre id="log" />
    </main>
  )
}
