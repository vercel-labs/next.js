import dynamic from 'next/dynamic'

const Decorated = dynamic(() => import('../components/Decorated'), { ssr: false })

export default function Other() {
  return (
    <div>
      <h1 id="other">Other page</h1>
      <Decorated />
    </div>
  )
}
