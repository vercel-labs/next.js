import { cookies } from 'next/headers'
export default async function Page() {
  const c = await cookies()
  return <p>ck: {c.get('x')?.value ?? 'none'}</p>
}
