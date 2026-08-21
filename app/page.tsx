/** Add your relevant code here for the issue to reproduce */
export default function Home() {
  return (
      <p>
        <a href="/throw-not-found">Throw notFound() page</a><br/>
        <a href="/throw-redirect">Throw redirect() page</a><br />
        <a href="/throw-misc-error">Throw misc Error page</a>
      </p>
  )
}
