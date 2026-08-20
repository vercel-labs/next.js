import clsx from 'clsx'
import { ITileProps } from './types'
import s from './Tile.module.scss'
import { JSX } from 'react'

export default function Tile({
  children,
  className,
  ...restProps
}: ITileProps): JSX.Element | null {
  return (
    <div className={clsx(s.wrapper, className)} {...restProps}>
      {children}
    </div>
  )
}
