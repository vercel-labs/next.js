import Counter from './counter'

export const runtime = 'edge'

export default function Page() {
  return (
    <main>
      <h1>edge runtime in a pnpm monorepo</h1>
      <Counter />
    </main>
  )
}
