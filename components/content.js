'use client'
import { use, isValidElement } from 'react'
import { BreadcrumbsContext } from './breadcrumbs-context'
export function Content({ children }) {
  const breadcrumbs = use(BreadcrumbsContext)
  return (
    <div>
      {isValidElement(breadcrumbs) && breadcrumbs}
      {children}
    </div>
  )
}
