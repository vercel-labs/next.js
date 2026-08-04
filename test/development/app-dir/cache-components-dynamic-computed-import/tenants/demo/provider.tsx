import type { ReactNode } from 'react'

import { ProviderClient } from './provider-client'

export function Provider({ children }: { children?: ReactNode }) {
  return <ProviderClient>{children}</ProviderClient>
}
