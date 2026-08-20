import Link from 'next/link'

export default function Other() {
  return (
    <div>
      <h1>other</h1>
      <Link href="/" id="to-home">
        Try to break
      </Link>
    </div>
  )
}
