// Deep import into a TypeScript source file shipped inside node_modules.
// duck-duck-scrape@2.2.5 ships src/*.ts; src/util.ts contains `export enum SafeSearchType`.
import { queryString } from 'duck-duck-scrape/src/util'

export default function Page() {
  return <pre>{queryString({ q: 'next.js' })}</pre>
}
