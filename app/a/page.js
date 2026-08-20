import './a.css'
import Link from 'next/link'
export default function A() { return <div data-target className="acard">A page <Link href="/b">to b</Link></div> }
