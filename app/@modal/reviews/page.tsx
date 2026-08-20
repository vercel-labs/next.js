import Link from 'next/link'
export default function Reviews() {
  return (
    <div id="reviews-slot">
      REVIEWS page exists only in the @modal slot (children has no /reviews route)
      <br />
      <Link href="/" id="go-home2">Home</Link>
    </div>
  )
}
