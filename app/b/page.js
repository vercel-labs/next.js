import Link from 'next/link'
import Text from '../../components/Text'
export default function B() { return <div><Text>page b</Text><Link href="/a">a</Link><Link href="/">home</Link></div> }
