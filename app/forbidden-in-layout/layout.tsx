import { forbidden } from 'next/navigation'
export default function Layout({ children }: { children: React.ReactNode }) {
  forbidden()
  return <>{children}</>
}
