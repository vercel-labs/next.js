'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Msg = { id: string; seq: number; at: number } | null
const Ctx = createContext<Msg>(null)

export function useLastEvent() {
  return useContext(Ctx)
}

export default function EventProvider({ children }: { children: React.ReactNode }) {
  const [last, setLast] = useState<Msg>(null)

  useEffect(() => {
    const es = new EventSource('/api/events')
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data)
        ;(window as any).__events = [...((window as any).__events || []), parsed]
        setLast(parsed)
      } catch {}
    }
    return () => es.close()
  }, [])

  return <Ctx.Provider value={last}>{children}</Ctx.Provider>
}
