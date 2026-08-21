import { readDynamic } from '../lib/dyn'
// swap for `readStatic` to see the trace shrink back to just package.json
// import { readStatic } from '../lib/dyn'

export const dynamic = 'force-dynamic'

export default function Page() {
  const pkg = readDynamic('package.json')
  return <pre>{pkg.length}</pre>
}
