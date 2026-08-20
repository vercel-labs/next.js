import styles from './page.module.css'
import Link from 'next/link'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Page() {
  await headers()
  return (
    <>
      <h1 className={styles.title}>CSS Modules + CSP nonce</h1>
      <Link href="/second">go to /second</Link>
    </>
  )
}
