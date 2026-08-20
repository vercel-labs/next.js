import { lazy } from 'react'

const Heavy = lazy(
  () => new Promise((resolve) => setTimeout(() => resolve(import('../components/Heavy')), 1000))
)

export default function LazyPage() {
  return <main id="lazy"><Heavy /></main>
}
