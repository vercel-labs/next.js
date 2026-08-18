import { run } from '../minified-helper'

export default function Page() {
  const rows = [{ g: 'a', r: 'b', l: 'ignored' }]
  return <p id="result">{run(rows)[0]({ l: 'c' })}</p>
}
