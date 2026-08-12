import type { ReactNode } from 'react'

async function CachedShell({ nav, body }: { nav: ReactNode; body: ReactNode }) {
  'use cache'

  return (
    <section>
      {nav}
      {body}
    </section>
  )
}

export default function Page() {
  return (
    <CachedShell
      nav={<nav id="nav">nav hole</nav>}
      body={<main id="body">body hole</main>}
    />
  )
}
