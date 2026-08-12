'use client'

import { useParams } from 'next/navigation'

// Renders the locale param exactly as the client router currently models
// it. During an optimistic navigation the router updates the params before
// the server responds, so this is where an incorrect prediction is
// observable.
export function LocaleProbe() {
  const params = useParams<{ locale: string }>()
  return <div id="client-locale">{String(params.locale)}</div>
}
