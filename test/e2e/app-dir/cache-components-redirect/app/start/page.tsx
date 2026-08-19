import Link from 'next/link'

export default function Start() {
  return (
    <>
      <p id="start">start page</p>
      <Link href="/gated" id="to-gated">
        go to gated
      </Link>
    </>
  )
}
