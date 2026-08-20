'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Simulates anything that invalidates the client router cache while on the
// detail page (router.refresh(), a server action, revalidatePath, ...).
export default function Refresher() {
  const router = useRouter()
  useEffect(() => {
    const t = setTimeout(() => router.refresh(), 200)
    return () => clearTimeout(t)
  }, [router])
  return null
}
