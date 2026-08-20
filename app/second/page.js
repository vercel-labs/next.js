import styles from './page.module.css'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export default function Second() {
  return (<><h1 className={styles.second}>second page</h1><Link href="/">home</Link></>)
}
