import Link from 'next/link'
import { cachedFn } from './cached'
import { connection } from 'next/server'

export async function generateMetadata() {
  console.log('[generateMetadata root layout]')
  await cachedFn()
  return { title: `t-${Date.now()}` }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection()
  console.log('[render root layout]')
  await cachedFn()
  return (
    <html lang="en">
      <body>
        <Link href="/with-loading">with-loading</Link>{' '}
        <Link href="/without-loading">without-loading</Link>
        {children}
      </body>
    </html>
  )
}
