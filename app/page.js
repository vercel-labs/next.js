import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1 id="heading-home">Home</h1>
      <p>Home content</p>
      {/* This link only exists on the home page, so after navigating away
          it is removed from the DOM and focus is lost. */}
      <Link href="/a" id="inline-link-a">Go to Page A (inline link, only on home)</Link>
      <button id="home-button">home button</button>
    </div>
  )
}
