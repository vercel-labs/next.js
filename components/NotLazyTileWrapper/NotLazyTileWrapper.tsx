import clsx from 'clsx'
import Tile from '../Tile'
import s from './NotLazyTileWrapper.module.scss'
import { JSX } from 'react'

export default function NotLazyTileWrapper({
  className,
}: {
  className?: string
}): JSX.Element | null {
  return <Tile className={clsx(s.wrapper, className)}>Red Background</Tile>
}
