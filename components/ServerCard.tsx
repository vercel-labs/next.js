import { ComponentLayout } from './ComponentLayout'
import styles from './ServerCard.module.css'

export function ServerCard() {
  return (
    <ComponentLayout className={styles.card}>
      ServerCard: should be GREEN (own class overrides ComponentLayout red)
    </ComponentLayout>
  )
}
