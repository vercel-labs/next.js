import styles from './tile.module.css'

export default function Tile({ className, children }) {
  return (
    <div id="tile" className={`${styles.wrapper} ${className}`}>
      {children}
    </div>
  )
}
