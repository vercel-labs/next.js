import { cookies } from 'next/headers'

// Uncached runtime data, so this subtree is excluded from the static shell and
// re-suspends on every navigation into the section.
export async function NavRail({ section }: { section: string }) {
  const cookieStore = await cookies()
  await new Promise((resolve) => setTimeout(resolve, 800))
  return (
    <nav data-nav-rail={section}>
      nav rail {section} ({cookieStore.size})
    </nav>
  )
}
