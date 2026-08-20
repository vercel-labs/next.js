'use client'

import { useParams } from 'next/navigation'

// Repro of https://github.com/vercel/next.js/issues/61951
export interface PageParams {
  storefront: string
  product: string
}

export type PageParamsType = {
  storefront: string
  product: string
}

export function ClientComponentInterface() {
  // Expected: no error. Actual: TS2344
  const params = useParams<PageParams>()
  return <div>{JSON.stringify(params, null, 4)}</div>
}

export function ClientComponentType() {
  // No error
  const params = useParams<PageParamsType>()
  return <div>{JSON.stringify(params, null, 4)}</div>
}
