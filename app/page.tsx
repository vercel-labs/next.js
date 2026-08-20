import { Buttons } from './buttons'

let pageRenders = 0

export default function Page() {
  pageRenders++
  console.log('[server] Page render #' + pageRenders)
  return (
    <main>
      <div id="page-renders">page-renders:{pageRenders}</div>
      <div id="page-id">page-id:{Math.random().toString(36).slice(2, 10)}</div>
      <Buttons />
    </main>
  )
}
