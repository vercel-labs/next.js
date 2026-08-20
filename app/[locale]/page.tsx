import Link from 'next/link'
export default function Page() {
  return (
    <div>
      <p id="home">home page</p>
      <Link id="link-vacancy" href="/en/vacancy/1">
        open vacancy 1
      </Link>
    </div>
  )
}
