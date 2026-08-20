'use client'
import { useSearchParams } from 'next/navigation'

export default function ClientParams() {
  const sp = useSearchParams()
  return <pre id="client-params">{JSON.stringify(Object.fromEntries(sp.entries()))}</pre>
}
