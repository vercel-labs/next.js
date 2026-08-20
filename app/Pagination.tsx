'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Pagination() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  return (
    <button id="next-page" onClick={() => router.replace(`?page=${page + 1}`)}>
      next page (client page={page})
    </button>
  )
}
