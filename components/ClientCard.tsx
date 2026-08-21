'use client'
import { ComponentLayout } from './ComponentLayout'
import styles from './ClientCard.module.css'

export function ClientCard() {
  return (
    <ComponentLayout className={styles.card}>
      ClientCard: should be BLUE
    </ComponentLayout>
  )
}
