import Link from 'next/link'
export default function Page() {
  return (<ul>
    <li><Link href="/coolFeatureA/mountain/work">A work</Link></li>
    <li><Link href="/coolFeatureA/mountain/home">A home</Link></li>
    <li><Link href="/coolFeatureB/mountain/work">B work</Link></li>
    <li><Link href="/coolFeatureB/mountain/home">B home</Link></li>
  </ul>)
}
