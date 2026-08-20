'use client'
import { useRouter } from 'next/navigation'
export default function RefreshButton() {
  const router = useRouter()
  return <button id="refresh" onClick={() => router.refresh()}>router.refresh()</button>
}
