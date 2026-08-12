import { ReactNode, Suspense } from 'react'
import { LocaleProbe } from '../../components/locale-probe'

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* useParams() reads a runtime value, so the probe streams in
          after the prerender. */}
      <Suspense fallback={<div id="locale-probe-loading">Loading...</div>}>
        <LocaleProbe />
      </Suspense>
      {children}
    </div>
  )
}
