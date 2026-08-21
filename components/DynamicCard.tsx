'use client'
import { ComponentLayout } from './ComponentLayout'
import styles from './DynamicCard.module.css'

export default function DynamicCard() {
  return (
    <ComponentLayout className={styles.card}>
      DynamicCard (next/dynamic): should be PURPLE
    </ComponentLayout>
  )
}
