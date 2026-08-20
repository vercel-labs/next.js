'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Inner() {
  const lang = useSearchParams().get('language') ?? 'en'
  // React 19: <title> rendered from a Client Component is hoisted into <head>
  return (<>
    <title>{`Client <title> for ${lang}`}</title>
    <h1>client-title, lang={lang}</h1>
  </>)
}
export default function Page() {
  return <Suspense><Inner /></Suspense>
}
