'use client'

import Link from 'next/link'
import styles from './Button.module.css'

export function Button({
  href,
  className,
  children,
}: {
  href?: string
  className?: string
  children: React.ReactNode
}) {
  const classes = [styles.button, styles.primary, className]
    .filter(Boolean)
    .join(' ')

  return href ? (
    <Link id="css-order-link" href={href} className={classes}>
      {children}
    </Link>
  ) : (
    <button className={classes}>{children}</button>
  )
}
