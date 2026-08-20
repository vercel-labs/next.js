'use client'
import { useRouter } from 'next/navigation'
export default function RootLayout({ children }) {
  const router = useRouter()
  return (<html lang="en"><body>
    <header style={{ display: 'flex', gap: 10 }}>
      <button onClick={() => router.push('/')}>/</button>
      <button onClick={() => router.push('/about')}>/about</button>
      <button onClick={() => router.push('/about?q=404')}>/about?q=404</button>
    </header>
    {children}
  </body></html>)
}
