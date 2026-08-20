import Link from 'next/link'
import Text from '../../components/Text'
export default function A() { return <div><Text>page a</Text><Link href="/b">b</Link><Link href="/">home</Link></div> }
