import { draftMode } from 'next/headers'
import { Toggle } from './toggle'

export const revalidate = 60

export default async function Page() {
  const { isEnabled } = await draftMode()
  return (
    <main>
      <Toggle />
      <p>
        Draft mode is <span id="status">{isEnabled ? 'enabled' : 'disabled'}</span>
      </p>
      <p id="rendered">rendered at {new Date().toISOString()}</p>
    </main>
  )
}
