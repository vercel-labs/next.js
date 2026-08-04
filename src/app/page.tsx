import { cookies } from 'next/headers'

// Blocking request-time read at the top of the page: this is exactly what the
// cache-components-instant-false codemod is supposed to opt out of.
export default async function Page() {
  const store = await cookies()
  return <p>theme: {store.get('theme')?.value ?? 'none'}</p>
}
