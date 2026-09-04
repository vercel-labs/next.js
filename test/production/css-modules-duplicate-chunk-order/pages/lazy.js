import dynamic from 'next/dynamic'
import Link from 'next/link'

// The CSS of this dynamically imported component ships in a separate CSS chunk
// that also contains a copy of `tile.module.css`.
const LazyTile = dynamic(() => import('../components/lazy-tile'), {
  ssr: false,
})

export default function LazyPage() {
  return (
    <>
      <LazyTile />
      <Link href="/to" id="to-link">
        /to
      </Link>
    </>
  )
}
