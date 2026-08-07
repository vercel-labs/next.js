import Link from 'next/link'

export default function Page() {
  return (
    <>
      <p id="home">home</p>
      <Link href="/тест" id="to-non-ascii">
        to non-ascii app page
      </Link>
    </>
  )
}
