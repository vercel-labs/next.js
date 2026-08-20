import dynamic from 'next/dynamic'

const LazyBlockPromise = import('../components/LazyTileWrapper')
const LazyBlock = dynamic(() => LazyBlockPromise, {
  ssr: false,
})

export default function LazyBlockPage() {
  return <LazyBlock />
}
