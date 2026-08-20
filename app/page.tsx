import { cookies } from 'next/headers'
import { setCookie } from './actions'

export default async function Page() {
  const store = await cookies()
  return (
    <main>
      <p id="cookie-value">foo={String(store.get('foo')?.value)}</p>
      <form action={setCookie}>
        <button id="set" type="submit">
          set cookie in server action
        </button>
      </form>
    </main>
  )
}
