import { hello } from 'lib'
import { fromDep } from 'dep'
export default function Page() {
  return (<><p id="app">app: {hello}</p><p id="dep">dep: {fromDep()}</p></>)
}
