import Link from 'next/link'
import { redirect } from 'next/navigation'

async function goToLogin() {
  'use server'
  redirect('/login')
}

export default async function Page({ params }) {
  const { locale } = await params
  return (
    <main>
      <h1 id="home">Home ({locale})</h1>
      <Link href="/login" id="link-login">Go To Login Page</Link>
      <form action={goToLogin}>
        <button type="submit" id="action-login">submit form (server action redirect)</button>
      </form>
    </main>
  )
}
