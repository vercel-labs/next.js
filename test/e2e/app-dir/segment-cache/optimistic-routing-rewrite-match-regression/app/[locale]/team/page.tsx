import { Suspense } from 'react'
import { connection } from 'next/server'

async function DynamicTeam({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await connection()
  const { locale } = await params
  return (
    <h1 id="team-page" data-locale={locale}>
      Team page: {locale}
    </h1>
  )
}

export default function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <main>
      <Suspense fallback={<div id="team-loading">Loading team...</div>}>
        <DynamicTeam params={params} />
      </Suspense>
    </main>
  )
}
