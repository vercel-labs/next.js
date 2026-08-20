import { redirect } from 'next/navigation'
import Counter from './counter'

export default async function Page({ searchParams }) {
  const sp = await searchParams
  async function go() {
    'use server'
    redirect('/?t=' + Date.now())
  }
  return (
    <main>
      <p id="server-value">server render: {String(sp.t ?? 'none')} @ {Date.now()}</p>
      <Counter />
      <form action={go}>
        <button id="redirect" type="submit">Click Me (server action redirect)</button>
      </form>
    </main>
  )
}
