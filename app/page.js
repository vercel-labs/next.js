import Link from 'next/link'
import { redirectToRoute, redirectToPage } from './actions'

export default function Home() {
  return (
    <div>
      <p><Link href="/route">Link to /route</Link></p>
      <p><Link href="/route" prefetch={false}>Link to /route without prefetch</Link></p>
      <p><Link href="/page-target">Link to /page</Link></p>
      <form action={redirectToRoute}><button id="redirect-route" type="submit">redirect to /route</button></form>
      <form action={redirectToPage}><button id="redirect-page" type="submit">redirect to /page</button></form>
    </div>
  )
}
