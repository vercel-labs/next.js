'use client'

import { Button } from '@ui-kit/components/Button/Button'
import styles from './Banner.module.css'

export function Banner() {
  return (
    <Button href="/css-order/catalog" className={styles.override}>
      Catalog
    </Button>
  )
}
