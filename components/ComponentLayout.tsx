import styles from './ComponentLayout.module.css'

export function ComponentLayout({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={`${styles.layout} ${className ?? ''}`}>{children}</div>
}
