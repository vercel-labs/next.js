import { WithParams } from './WithParams'
import { WithoutParams } from './WithoutParams'
import { ReplaceStateButton } from './ReplaceStateButton'

export default function Page() {
  return (
    <main>
      <ReplaceStateButton />
      <WithParams />
      <WithoutParams />
    </main>
  )
}
