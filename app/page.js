import { urlReg } from '../lib/target'

export default function Page() {
  return <p>url regex length: {urlReg.source.length}</p>
}
