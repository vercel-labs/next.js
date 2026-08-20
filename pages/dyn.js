import dynamic from 'next/dynamic'

const Heavy = dynamic(
  () => new Promise((resolve) => setTimeout(() => resolve(import('../components/Heavy')), 1000)),
  { ssr: false }
)

export default function DynPage() {
  return <main id="dyn"><Heavy /></main>
}
