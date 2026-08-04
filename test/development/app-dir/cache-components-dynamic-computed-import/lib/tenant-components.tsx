import dynamic from 'next/dynamic'
import type { ComponentType, ReactNode } from 'react'

export type ProviderProps = {
  children?: ReactNode
}

export function getTenantComponents(tenant: string): {
  Navbar: ComponentType
  Provider: ComponentType<ProviderProps>
} {
  // A computed (template literal) import path, so the loader is only resolvable
  // at runtime. The imported module is a Server Component that renders a
  // Client Component descendant.
  const Provider = dynamic<ProviderProps>(() =>
    import(`../tenants/${tenant}/provider`).then((mod) => mod.Provider)
  )

  const Navbar = dynamic(() =>
    import(`../tenants/${tenant}/navbar`).then((mod) => mod.Navbar)
  )

  return { Navbar, Provider }
}
