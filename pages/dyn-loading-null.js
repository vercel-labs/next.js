import dynamic from 'next/dynamic'
// Reporter's claim: trying to opt out of the internal Suspense fallback crashes.
const Heavy = dynamic(
  () => new Promise((resolve) => setTimeout(() => resolve(import('../components/Heavy')), 1000)),
  { ssr: false, loading: null }
)
export default function Page() {
  return <main id="dyn-null"><Heavy /></main>
}
