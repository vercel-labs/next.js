import { redirect } from 'next/navigation'

export default function Home() {
  const user = false
  if (!user) {
    redirect('/login')
  }
  return <h1>Home</h1>
}
