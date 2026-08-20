import styles from './page.module.css'

export default function Home() {
  return (
    <div>
      <div id="a" className={styles.description}>description</div>
      <div id="b" className={styles.largeDescription}>styles.largeDescription (camelCase -> undefined)</div>
      <div id="c" className={styles['large-description']}>styles['large-description'] (works)</div>
      <pre id="keys">{JSON.stringify(styles)}</pre>
    </div>
  )
}
