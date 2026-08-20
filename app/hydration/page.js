import Mismatch from './mismatch'
export default function Page() {
  return (
    <main>
      <h1>Hydration mismatch repro for next.js#47351</h1>
      <Mismatch />
    </main>
  )
}
