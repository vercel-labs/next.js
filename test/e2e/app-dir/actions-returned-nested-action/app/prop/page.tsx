import { outer } from '../actions'
import { ReturnedNestedAction } from '../client'

export default function Page() {
  return <ReturnedNestedAction outer={outer} />
}
