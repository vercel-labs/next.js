import { HydrationProbe } from './components/hydration-probe'

export default function Home() {
  return (
    <main>
      <h1>next.js#91448</h1>
      <HydrationProbe />
      <h2>client errors</h2>
      <pre id="client-errors" style={{ whiteSpace: 'pre-wrap', color: 'red' }} />
    </main>
  )
}
