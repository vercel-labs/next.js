import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
export default async function Layout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-pathname')
  if (!pathname?.startsWith('/ok/child')) redirect('/ok/child')
  return <>{children}</>
}
