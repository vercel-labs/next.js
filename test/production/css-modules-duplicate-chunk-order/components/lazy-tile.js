import Tile from './tile'
import styles from './lazy-tile.module.css'

export default function LazyTile() {
  return <Tile className={styles.wrapper}>Lazy Tile</Tile>
}
