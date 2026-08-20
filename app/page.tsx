import Link from 'next/link'
export default function Home() {
  return <ul>{['/sticky/a','/fixed/a','/title/a'].map(h=> <li key={h}><Link href={h}>{h}</Link></li>)}</ul>
}
