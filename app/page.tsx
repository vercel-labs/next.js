import Link from 'next/link'

export default function Home() {
  return (
    <ul>
      <li><Link href="/minutes">cacheLife("minutes")</Link></li>
      <li><Link href="/seconds">cacheLife("seconds")</Link></li>
      <li><Link href="/expire299">cacheLife({'{ expire: 299 }'})</Link></li>
    </ul>
  )
}
