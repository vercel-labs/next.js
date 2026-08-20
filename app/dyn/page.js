'use client'
import dynamic from 'next/dynamic'
import Text from '../../components/Text'
const DynamicChild = dynamic(() => import('../../components/DynamicChild'), { ssr: false })
export default function DynPage() {
  return (<div><Text>static in client page</Text><DynamicChild /></div>)
}
