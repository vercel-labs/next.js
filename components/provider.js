'use client'
import { BreadcrumbsContext } from './breadcrumbs-context'
export default function BreadcrumbsProvider({ breadcrumbs, children }) {
  return (
    <BreadcrumbsContext.Provider value={breadcrumbs}>
      {children}
    </BreadcrumbsContext.Provider>
  )
}
