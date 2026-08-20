import clsx from 'clsx'
import Tile from '../Tile'
import s from './LazyTileWrapper.module.scss'
import { IFIltersFormModalProps } from './types'

export default function LazyTileWrapper({ className }: IFIltersFormModalProps) {
  return <Tile className={clsx(s.wrapper, className)}>Hello</Tile>
}
