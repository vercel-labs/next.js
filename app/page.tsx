import { cookies } from 'next/headers'

export default function Page() {
  async function addCookie() {
    'use server'
    const c = await cookies()
    // @ts-expect-error encode is not in the public option types
    c.set('sa_cookie', 'qwerty123=', { encode: String })
  }
  return (
    <form action={addCookie}>
      <button type="submit">Add cookie</button>
    </form>
  )
}
