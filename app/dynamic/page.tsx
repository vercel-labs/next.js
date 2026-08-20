import { cookies } from 'next/headers'

export default async function DynamicPage() {
  const c = await cookies()
  return <h1 id="page">Dynamic {c.get('x')?.value ?? 'nocookie'}</h1>
}
