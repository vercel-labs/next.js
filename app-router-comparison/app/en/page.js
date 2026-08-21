import Link from 'next/link'
export default function Page() {
  return (<main><Link id="anchor-link" href="#about">About</Link><div style={{height:1200}}/><h2 id="about">About</h2></main>)
}
