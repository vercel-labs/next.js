'use client'

import { createContext, useContext } from 'react'
import { useSearchParams } from 'next/navigation'

const Ctx = createContext<number | null>(null)
export const useGlobal = () => useContext(Ctx)

export default function GlobalProvider({ children }: { children: React.ReactNode }) {
  // documented "opt out of static rendering / render on the client" hook
  useSearchParams()

  console.log(
    '>>> GlobalProvider:',
    typeof window === 'undefined' ? 'SERVER' : 'CLIENT'
  )

  // reporter's code touched `window` directly during render
  const width = window.innerWidth

  return <Ctx.Provider value={width}>{children}</Ctx.Provider>
}
