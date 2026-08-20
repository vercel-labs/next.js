'use client'
import { useRouter, useSearchParams } from 'next/navigation'
export default function SearchInput({ id }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  return (
    <input
      id={id}
      defaultValue={searchParams.get('q') ?? ''}
      placeholder="type a query"
      onChange={(e) => router.replace(`/search?q=${encodeURIComponent(e.target.value)}`)}
    />
  )
}
