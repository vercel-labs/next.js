// `filter-obj@5.1.0` ships untranspiled ES2020 syntax (`descriptor?.enumerable`)
// in `node_modules`, which is what the linked issue reports.
import { includeKeys } from 'filter-obj'

export default function Page() {
  return <p id="result">{Object.keys(includeKeys({ a: 1, b: 2 }, ['a']))}</p>
}
