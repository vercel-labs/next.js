'use client'

import { useRouter } from 'next/navigation'
import { createBoardAction } from './actions'

// Set to true to push in a macrotask instead (extra request disappears).
const PUSH_IN_TIMEOUT = false

export default function Home() {
  const router = useRouter()

  return (
    <form
      action={async (formData: FormData) => {
        const { slug } = await createBoardAction(formData)
        if (PUSH_IN_TIMEOUT) {
          setTimeout(() => router.push(`/dashboard/${slug}`), 0)
        } else {
          router.push(`/dashboard/${slug}`)
        }
      }}
    >
      <input
        id="title"
        name="title"
        defaultValue=""
        required
        onBlur={(e) => {
          const value = e.target.value.trim()
          if (!value) return
          // prefetch the exact URL we will push to after the action resolves
          router.prefetch(`/dashboard/${value.toLowerCase().replace(/\s+/g, '-')}`)
        }}
      />
      <button type="submit">Create Board</button>
    </form>
  )
}
