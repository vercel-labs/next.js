'use client'
// Workaround suggested by a maintainer in the issue thread
const wasmUrl = new URL('../../assets/add.wasm', import.meta.url).href

export default function Page() {
  return <p id="url">wasm url: {wasmUrl}</p>
}
