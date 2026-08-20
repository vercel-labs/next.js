import NotLazyTileWrapper from '../components/NotLazyTileWrapper/NotLazyTileWrapper'
import s from './to.module.scss'

export default function PageWithNotLazyTileWrapper() {
  return <NotLazyTileWrapper className={s.summary} />
}
