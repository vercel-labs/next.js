import dynamic from 'next/dynamic'
import Link from 'next/link'
import Text from '../components/Text'

const DynamicChild = dynamic(() => import('../components/DynamicChild'))

export default function Page() {
  return (
    <main>
      <Text>Statically imported Text</Text>
      <DynamicChild />
      <nav>
        <Link href="/a">a</Link> <Link href="/b">b</Link>
      </nav>
    </main>
  )
}
