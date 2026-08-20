import { redirect } from 'next/navigation'
export default async function Layout({ children }: { children: React.ReactNode }) {
  redirect('/b')
  return <>{children}</>
}
