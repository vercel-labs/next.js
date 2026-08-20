// ESM-style explicit extension: TypeScript recommends `.js` for a `.ts` source file
import { greeting } from './lib/greeting.js'

export default function Page() {
  return <p>{greeting()}</p>
}
