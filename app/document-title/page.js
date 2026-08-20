'use client'
import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function Inner() {
  const lang = useSearchParams().get('language') ?? 'en'
  useEffect(() => {
    document.title = `Title for ${lang}`
  }, [lang])
  return <h1>document.title workaround, lang={lang}</h1>
}
export default function Page() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  )
}
