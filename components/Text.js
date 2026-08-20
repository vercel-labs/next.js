import styles from './Text.module.css'
export default function Text({ children }) {
  return <p className={styles.text}>{children}</p>
}
