import { MyErrorBoundary } from './error-boundary'
import { RedirectingClient } from './redirecting-client'

export default function Page() {
  return (
    <main>
      <h1>redirect() inside a user-land error boundary</h1>
      <MyErrorBoundary>
        <RedirectingClient />
      </MyErrorBoundary>
      <p>
        <a href="/no-boundary">control: same component without error boundary</a>
      </p>
    </main>
  )
}
