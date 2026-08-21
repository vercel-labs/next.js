import { ComponentLayout } from './ComponentLayout'
import styles from './HeaderCard.module.css'

export function HeaderCard({ children }: { children: React.ReactNode }) {
  return <ComponentLayout className={styles.overrideHeader}>{children}</ComponentLayout>
}
