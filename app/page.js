import Link from 'next/link'
export default function Home() {
  return (<main><h1>home</h1><Link href="/en" id="to-en">go to /en (client-side nav)</Link></main>)
}
