'use client'
import { createContext, useContext, useState } from 'react'
const Ctx = createContext(null)
export function Providers({ children }) {
  const [theme] = useState('light')
  return <Ctx.Provider value={{ theme }}>{children}</Ctx.Provider>
}
export function useTheme() {
  return useContext(Ctx)
}
