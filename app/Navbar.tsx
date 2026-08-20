import Link from "next/link"

export default function Navbar() {
  return (
    <nav>
      <Link href="/" style={{padding: '10px', background: 'green'}}>Home</Link>
      <Link href="/search" style={{padding: '10px',  background: 'green'}}>Search</Link>
    </nav>
  )
}