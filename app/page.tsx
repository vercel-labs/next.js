import Link from 'next/link'

export default function Page() {
  return (
    <main>
      <h1>next#97417 repro</h1>
      <p>
        Go to <Link href="/nav-test">/nav-test</Link> and follow the steps in the README.
      </p>
    </main>
  )
}
