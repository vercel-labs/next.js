import { excludeKeys } from 'filter-obj'

const obj = { a: 'a', b: 'b' }

export default function Home() {
  return <main>Repro {JSON.stringify(excludeKeys(obj, (key) => key === 'b'))}</main>
}
