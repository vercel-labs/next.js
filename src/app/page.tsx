import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <Link href={'/bug'} target='_blank'>/bug</Link> will rewrite to /error and causes an hydration error when navigating directly to it.
      <code className='error'>Text content does not match server-rendered HTML. <Link href="https://legacy.reactjs.org/docs/error-decoder.html/?invariant=425" target='_blank'>[425]</Link><br />Hydration failed because the initial UI does not match what was rendered on the server. <Link href="https://legacy.reactjs.org/docs/error-decoder.html/?invariant=418" target='_blank'>[418]</Link>
      </code>
    </main>
  )
}
