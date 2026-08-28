import { cookies } from 'next/headers'
import GoButton from './go-button'

export const dynamic = 'force-dynamic'

export default async function StartPage() {
  const mode = (await cookies()).get('mode')?.value ?? 'none'
  const stamp = Date.now()
  console.log(`[server] rendering /start mode=${mode} stamp=${stamp}`)
  return (
    <main>
      <h1 id="page">Start</h1>
      <p id="mode">mode={mode}</p>
      <p id="stamp">{stamp}</p>
      <GoButton />
    </main>
  )
}
