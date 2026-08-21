'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export function Filters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const current = params.get('filter') ?? 'a'
  return (
    <div>
      {['a', 'b', 'c'].map((f) => (
        <button
          key={f}
          id={`filter-${f}`}
          onClick={() => {
            window.__clickTs = performance.now()
            router.push(`${pathname}?filter=${f}`)
          }}
          style={{ fontWeight: current === f ? 'bold' : 'normal' }}
        >
          filter {f}
        </button>
      ))}
      <div id="active-filter">active: {current}</div>
    </div>
  )
}
