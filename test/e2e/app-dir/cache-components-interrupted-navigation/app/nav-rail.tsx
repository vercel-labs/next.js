import { cookies } from 'next/headers'

// Uncached runtime data, so this subtree is excluded from the static shell and
// re-suspends on every navigation.
export async function NavRail({ section }: { section: string }) {
  const cookieStore = await cookies()
  await new Promise((resolve) => setTimeout(resolve, 700))
  return (
    <nav data-navrail={section}>
      nav {section} for {cookieStore.get('session')?.value ?? 'anon'}
    </nav>
  )
}
