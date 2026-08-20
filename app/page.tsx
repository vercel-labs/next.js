import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1 id="home">Home</h1>
      <Link href="/photo/1" id="open-modal">Open photo 1 (intercepted modal)</Link>
      <br />
      <Link href="/about" id="go-about">Go to /about (should dismiss modal)</Link>
    </div>
  )
}
