import Link from 'next/link'

export const metadata = { title: 'Home page' }

export default function Page() {
  return (
    <main>
      <h1>Home page</h1>
      <Link id="to-erroring" href="/erroring-page">
        Go to erroring page
      </Link>
    </main>
  )
}
