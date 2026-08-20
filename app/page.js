import Link from 'next/link'
export const metadata = { title: 'Server component title (works)' }
export default function Page() {
  return (<ul>
    <li><Link href="/client-title?language=fr">/client-title — React 19 &lt;title&gt; in a Client Component</Link></li>
    <li><Link href="/document-title?language=fr">/document-title — document.title workaround</Link></li>
  </ul>)
}
