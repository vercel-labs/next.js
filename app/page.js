import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.main}>
      <input id="num" className={styles.input} type="number" placeholder="Hover me" />
    </div>
  )
}
