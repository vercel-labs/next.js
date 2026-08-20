import * as wasm from '../wasm/add.wasm'

export function getServerSideProps() {
  return { props: { sum: wasm.add(2, 3) } }
}

export default function Home({ sum }) {
  return <p id="sum">2 + 3 = {sum}</p>
}
